import type { Metadata, Viewport } from 'next';
import { Instrument_Serif } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const BASE_URL = 'https://cybersage.dev';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'Ziad Elsaid | Infrastructure & Systems Architect',
    template: '%s | Ziad Elsaid',
  },

  description:
    'Ziad Elsaid (Cybersage) — Infrastructure & Systems Architect with 5+ years designing distributed, production-grade platforms. Cloud architecture, DevOps, Go & Django backends, PostgreSQL, AWS. Available for hire — remote, worldwide.',

  keywords: [
    // Brand / name
    'Ziad Elsaid',
    'Elsaid Ziad',
    'Cybersage',
    'cybersage.dev',
    'Cybersage developer',
    'Donrington',
    // Role
    'Infrastructure Architect',
    'Systems Architect',
    'Solutions Architect',
    'Cloud Architect',
    'Platform Engineer',
    'Backend Architect',
    'DevOps Engineer',
    'Site Reliability Engineer',
    'Software Engineer',
    'Full Stack Engineer',
    'Backend Engineer',
    'Go Developer',
    'Golang Developer',
    'Django Developer',
    'Next.js Developer',
    'Python Developer',
    // Hire intent
    'hire systems architect',
    'hire cloud architect',
    'hire infrastructure architect',
    'hire platform engineer',
    'hire backend architect',
    'hire software engineer',
    'freelance solutions architect',
    'freelance software engineer',
    'remote systems architect for hire',
    'contract architect',
    'available for hire',
    // Tech stack
    'AWS',
    'Docker',
    'Kubernetes',
    'Terraform',
    'Go',
    'Django',
    'PostgreSQL',
    'Redis',
    'Next.js',
    'distributed systems',
    'system design',
    'infrastructure as code',
    'REST API development',
    'Microservices',
    'CI/CD',
    'high availability architecture',
    // Portfolio / reach
    'Systems Architect portfolio',
    'Cloud Architect portfolio',
    'Software Engineer portfolio',
    'Nigerian software engineer',
    'African developer',
    'remote developer worldwide',
    'enterprise web development',
    'scalable web applications',
    'production-grade web systems',
    'high-performance web apps',
    // Niche specialisations
    'AI engineer',
    'computer vision developer',
    'embedded systems developer',
    'WebRTC developer',
    'real-time systems engineer',
    'HIPAA compliant development',
    'AI surveillance system',
    'regulated industries software',
  ],

  authors: [{ name: 'Ziad Elsaid', url: BASE_URL }],
  creator: 'Ziad Elsaid',
  publisher: 'Ziad Elsaid',

  icons: {
    icon: [{ url: '/logo/logo_white.png', type: 'image/png' }],
    apple: '/logo/logo_white.png',
    shortcut: '/logo/logo_white.png',
  },

  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Cybersage — Ziad Elsaid',
    title: 'Ziad Elsaid | Infrastructure & Systems Architect',
    description:
      '5+ years architecting distributed, production-grade systems. AWS · Docker · Go · Django · PostgreSQL · Redis. Available for hire — remote, worldwide.',
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/cybersage_og.png`,
        width: 1200,
        height: 630,
        alt: 'Ziad Elsaid — Infrastructure & Systems Architect',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@CarlSwitch_CHUG',
    creator: '@CarlSwitch_CHUG',
    title: 'Ziad Elsaid | Infrastructure & Systems Architect',
    description:
      '5+ years architecting production-grade distributed systems. AWS · Docker · Go · Django · PostgreSQL. Available for hire worldwide.',
    images: [`${BASE_URL}/cybersage_og.png`],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-US': BASE_URL,
      'en-GB': BASE_URL,
    },
  },

  category: 'technology',

  appleWebApp: {
    capable: true,
    title: 'Cybersage',
    statusBarStyle: 'black-translucent',
  },

  other: {
    'theme-color': '#0A0A0A',
    'msapplication-TileColor': '#0A0A0A',
    'application-name': 'Cybersage',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${BASE_URL}/#person`,
  name: 'Ziad Elsaid',
  alternateName: ['Cybersage', 'Elsaid Ziad', 'Donrington'],
  url: BASE_URL,
  image: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/cybersage_og.png`,
    width: 1200,
    height: 630,
  },
  jobTitle: 'Infrastructure & Systems Architect',
  description:
    'Infrastructure & Systems Architect with 5+ years of experience designing distributed, production-grade platforms — cloud infrastructure, DevOps pipelines, and resilient backends on AWS, Docker, Go, Django, and PostgreSQL.',
  email: 'ziadelsaid.dev@gmail.com',
  nationality: { '@type': 'Country', name: 'Egypt' },
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Infrastructure & Systems Architect',
    description:
      'Designs cloud infrastructure, distributed backends, and system architecture for clients worldwide — from data models and service boundaries to zero-downtime deployment.',
    occupationLocation: { '@type': 'Country', name: 'Worldwide' },
    skills:
      'System Design, Cloud Architecture, AWS, Docker, Kubernetes, CI/CD, Go, Django, PostgreSQL, Redis, Microservices, REST APIs, Next.js, React, TypeScript',
  },
  knowsAbout: [
    'System Design', 'Cloud Architecture', 'Distributed Systems',
    'AWS', 'Docker', 'Kubernetes', 'Terraform',
    'CI/CD', 'DevOps', 'Infrastructure as Code',
    'Go', 'Django', 'Python', 'Node.js',
    'PostgreSQL', 'Redis', 'MongoDB',
    'REST APIs', 'Microservices', 'High Availability',
    'Web Performance Optimisation',
    'Next.js', 'React', 'TypeScript', 'JavaScript',
    'Computer Vision', 'Embedded Systems', 'WebRTC',
    'Real-time Systems', 'AI Engineering', 'HIPAA Compliance',
  ],
  makesOffer: [
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Systems Architecture & Design',
        description:
          'Data models, service boundaries, API contracts, and capacity planning — system design before production code.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Cloud Infrastructure & DevOps',
        description:
          'AWS cloud infrastructure, CI/CD pipelines, Docker containerisation, and zero-downtime deployment automation.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Distributed Backend & API Engineering',
        description:
          'Go and Django services with rate-limiting, idempotency, circuit breakers, and caching strategies built for scale.',
      },
    },
    {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: 'Full Stack Product Delivery',
        description:
          'High-performance React and Next.js frontends built on top of sound architecture — end-to-end delivery.',
      },
    },
  ],
  sameAs: [
    'https://github.com/ZiadElsaidd',
    'https://www.linkedin.com/in/ziadelsaid-dev',
    'https://x.com/ZiadElsaidd',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'ziadelsaid.dev@gmail.com',
    contactType: 'professional inquiry',
    availableLanguage: 'English',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Cybersage — Ziad Elsaid',
  description:
    'Portfolio and professional profile of Ziad Elsaid — Infrastructure & Systems Architect.',
  author: { '@id': `${BASE_URL}/#person` },
  publisher: { '@id': `${BASE_URL}/#person` },
  inLanguage: 'en-US',
  copyrightYear: new Date().getFullYear(),
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const profilePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${BASE_URL}/#profilepage`,
  url: BASE_URL,
  name: 'Ziad Elsaid — Infrastructure & Systems Architect Portfolio',
  description:
    'Professional portfolio of Ziad Elsaid (Cybersage), an Infrastructure & Systems Architect with 5+ years of experience designing production-grade distributed systems.',
  dateCreated: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
  mainEntity: { '@id': `${BASE_URL}/#person` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={instrumentSerif.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
