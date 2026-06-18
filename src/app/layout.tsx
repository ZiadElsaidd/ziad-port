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

const BASE_URL = 'https://ziad-port.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: 'Ziad Elsaid | Full Stack Developer & Web Designer',
    template: '%s | Ziad Elsaid',
  },

  description:
    'Ziad Elsaid (Full Stack Developer) — Full Stack Developer with 5+ years building production-grade web applications and end-to-end product delivery. Frontend, backend, APIs, and performance-oriented UI/UX. Available for hire — remote, worldwide.',

  keywords: [
    // Brand / name
    'Ziad Elsaid',
    'Full Stack Developer',
    'Vertex Software Solutions',
    // Role
    'Full Stack Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Next.js Developer',
    'React Developer',
    'Web Developer',
    'Remote Developer',
    'Freelance Developer',
    'Available for hire',
    // Hire intent
    'hire full stack developer',
    'hire frontend developer',
    'hire backend developer',
    // Tech stack
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'Django',
    'PostgreSQL',
    'Redis',
    'Tailwind CSS',
    'Framer Motion',
    'GSAP',
    // Portfolio / reach
    'Software Engineer portfolio',
    'remote developer worldwide',
    'scalable web applications',
    'high-performance web apps',
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
    siteName: 'Full Stack Developer — Ziad Elsaid',
    title: 'Ziad Elsaid | Full Stack Developer & Web Designer',
    description:
      '5+ years building production-grade web applications. Frontend · Backend · APIs · Performance. Available for hire — remote, worldwide.',
    locale: 'en_US',
    images: [
      {
        url: `${BASE_URL}/public/logo/verr.png`,
        width: 1200,
        height: 630,
        alt: 'Ziad Elsaid — Full Stack Developer & Web Designer',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@CarlSwitch_CHUG',
    creator: '@CarlSwitch_CHUG',
    title: 'Ziad Elsaid | Full Stack Developer',
    description:
      '5+ years building production-grade web applications. Frontend · Backend · APIs. Available for hire worldwide.',
    images: [`${BASE_URL}/public/logo/verr.png`],
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
    title: 'Vertex Software Solutions',
    statusBarStyle: 'black-translucent',
  },

  other: {
    'theme-color': '#0A0A0A',
    'msapplication-TileColor': '#0A0A0A',
    'application-name': 'Vertex Software Solutions',
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
  alternateName: ['Vertex Software Solutions', 'Elsaid Ziad', 'Donrington'],
  url: BASE_URL,
  image: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/public/logo/verr.png`,
    width: 1200,
    height: 630,
  },
  jobTitle: 'Full Stack Developer',
  description:
    'Full Stack Developer with 5+ years of experience building production-grade web applications — frontend and backend development, API design, performance optimisation, and reliable deployments.',
  email: 'ziadelsaid.dev@gmail.com',
  nationality: { '@type': 'Country', name: 'Egypt' },
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Full Stack Developer',
    description:
      'Designs and implements end-to-end web applications, from UI/UX and frontend performance to backend APIs and deployment pipelines.',
    occupationLocation: { '@type': 'Country', name: 'Worldwide' },
    skills:
      'Frontend Development, Backend Development, API Design, Performance Optimisation, Next.js, React, TypeScript, Node.js, Django, PostgreSQL, Redis',
  },
  knowsAbout: [
    'Frontend Development', 'Backend Development', 'API Design',
    'Next.js', 'React', 'TypeScript', 'JavaScript',
    'Node.js', 'Django', 'PostgreSQL', 'Redis',
    'REST APIs', 'CI/CD', 'Performance Optimisation',
  ],
  makesOffer: [
    {
      '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Full Stack Development',
          description:
            'End-to-end web application development including frontend, backend, and API integration.',
        },
    },
    {
      '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Deployment & CI/CD Support',
          description:
            'Deployment pipelines, containerisation support, and continuous delivery for reliable releases.',
        },
    },
    {
      '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Backend & API Engineering',
          description:
            'Design and implement robust backend services and REST/GraphQL APIs with testing and documentation.',
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
  name: 'Vertex Software Solutions — Ziad Elsaid',
  description:
    'Portfolio and professional profile of Ziad Elsaid — Full Stack Developer.',
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
  name: 'Ziad Elsaid — Full Stack Developer Portfolio',
  description:
    'Professional portfolio of Ziad Elsaid — Full Stack Developer with 5+ years of experience building production-grade web applications.',
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
