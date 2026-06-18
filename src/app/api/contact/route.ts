import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { 
  sanitizeInput, 
  validateEmail, 
  checkRateLimit, 
  getClientIP,
  createErrorResponse,
  createSuccessResponse,
  validateRequestBody
} from '@/lib/security';

function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function readLogoB64(filename: string): string {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', 'logo', filename));
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    return '';
  }
}

const LOGO_HORIZONTAL = readLogoB64('/public/logo/verr.png');
const LOGO_ICON = readLogoB64('/public/logo/verr.png');

function emailTemplate({ name, email, message }: { name: string; email: string; message: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Message — Ziad Elsaid</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; font-family: 'Inter', system-ui, sans-serif; color: #e5e5e5; }
  </style>
</head>
<body style="background:#0a0a0a; padding: 0; margin: 0;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0a; padding: 48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- Logo bar -->
          <tr>
            <td style="padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <img
                      src="${LOGO_HORIZONTAL}"
                      alt="Vertex Software Solutions"
                      width="140"
                      style="display:block; height:auto;"
                    />
                  </td>
                  <td align="right">
                    <span style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.25); font-weight:500;">
                      Portfolio Inquiry
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding: 48px 0 36px;">
              <p style="font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:rgba(255,255,255,0.28); font-weight:500; margin-bottom:16px;">
                New Message Received
              </p>
              <h1 style="font-size:36px; font-weight:700; color:#ffffff; letter-spacing:-0.03em; line-height:1.1; margin:0;">
                You have a<br/>
                <span style="color:rgba(255,255,255,0.35); font-weight:300; font-style:italic;">new inquiry</span>
              </h1>
            </td>
          </tr>

          <!-- Sender card -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);">
                <tr>
                  <td style="padding: 28px 32px;">
                    <p style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.22); font-weight:500; margin-bottom:8px;">
                      From
                    </p>
                    <p style="font-size:22px; font-weight:600; color:#ffffff; letter-spacing:-0.02em; margin-bottom:4px;">
                      ${name}
                    </p>
                    <a href="mailto:${email}"
                      style="font-size:13px; color:rgba(255,255,255,0.45); text-decoration:none; letter-spacing:0.01em;">
                      ${email}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding-bottom: 40px;">
              <p style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.22); font-weight:500; margin-bottom:16px;">
                Message
              </p>
              <div style="border-left: 2px solid rgba(255,255,255,0.15); padding-left: 24px;">
                <p style="font-size:15px; line-height:1.8; color:rgba(255,255,255,0.7); white-space:pre-line;">
                  ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                </p>
              </div>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding-bottom: 48px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#ffffff;">
                    <a href="mailto:${email}"
                      style="display:inline-block; padding: 14px 32px; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; font-weight:600; color:#0a0a0a; text-decoration:none;">
                      Reply to ${name} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 32px; padding-bottom: 8px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <img
                      src="${LOGO_ICON}"
                      alt=""
                      width="28"
                      style="display:block; height:auto; opacity:0.3;"
                    />
                  </td>
                  <td align="right">
                    <p style="font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.18);">
                      ziadelsaid.dev@gmail.com
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 20px;">
              <p style="font-size:10px; letter-spacing:0.12em; color:rgba(255,255,255,0.12); line-height:1.8;">
                This message was submitted via the contact form at ziad-port.vercel.app<br/>
                © 2026 Ziad Elsaid · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(req);
    if (!checkRateLimit(ip, 5)) { // 5 emails per minute
      return createErrorResponse('Too many contact requests. Please try again later.', 429);
    }

    const body = await req.json();
    const { name, email, message } = body;

    // Validate request body
    const validation = validateRequestBody(body, {
      name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
      email: { required: true, type: 'string', maxLength: 254 },
      message: { required: true, type: 'string', minLength: 5, maxLength: 5000 },
    });

    if (!validation.valid) {
      return createErrorResponse(`Validation error: ${validation.errors.join(', ')}`, 400);
    }

    // Validate email format
    if (!validateEmail(email)) {
      return createErrorResponse('Invalid email format', 400);
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name).trim();
    const sanitizedMessage = sanitizeInput(message).trim();

    if (!sanitizedName || !sanitizedMessage) {
      return createErrorResponse('Invalid input data', 400);
    }

    const resend = getResendClient();
    if (!resend) {
      return createErrorResponse('Service temporarily unavailable', 500);
    }

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'ziadelsaid.dev@gmail.com',
      replyTo: email,
      subject: `New message from ${sanitizedName} — Portfolio`,
      html: emailTemplate({ name: sanitizedName, email, message: sanitizedMessage }),
    });

    if (error) {
      console.error('Email send error:', error);
      return createErrorResponse('Failed to send message', 500);
    }

    return createSuccessResponse({ success: true });
  } catch (err) {
    console.error('Contact route error:', err);
    return createErrorResponse('An error occurred', 500);
  }
}
