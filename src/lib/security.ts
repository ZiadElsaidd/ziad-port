import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in-memory, replace with Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Constants
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute per IP

/**
 * Sanitize input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate URL to prevent SSRF attacks
 */
export function validateURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Whitelist protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    // Prevent localhost/internal addresses
    if (/^(127\.|192\.168\.|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.|localhost|0\.0\.0\.0)/.test(parsed.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Rate limiting middleware
 */
export function checkRateLimit(ip: string, limit: number = RATE_LIMIT_MAX_REQUESTS): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get client IP address
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const clientIP = forwarded ? forwarded.split(',')[0].trim() : 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  return clientIP;
}

/**
 * Create secure error response
 */
export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    { error: message },
    { status, headers: getSecurityHeaders() }
  );
}

/**
 * Create success response with security headers
 */
export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(
    data,
    { status, headers: getSecurityHeaders() }
  );
}

/**
 * Security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' *.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' https:; frame-ancestors 'none';",
  };
}

/**
 * Validate API request structure
 */
export function validateRequestBody(body: any, schema: Record<string, any>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = body[key];

    if (rules.required && !value) {
      errors.push(`${key} is required`);
      continue;
    }

    if (value && rules.type) {
      if (typeof value !== rules.type) {
        errors.push(`${key} must be of type ${rules.type}`);
      }
    }

    if (value && rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      errors.push(`${key} must be at most ${rules.maxLength} characters`);
    }

    if (value && rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      errors.push(`${key} must be at least ${rules.minLength} characters`);
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${key} has invalid format`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Add security middleware to request
 */
export function withSecurityMiddleware(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const ip = getClientIP(req);
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return createErrorResponse('Too many requests. Please try again later.', 429);
    }

    // Add security headers to response
    const response = await handler(req);
    Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
}
