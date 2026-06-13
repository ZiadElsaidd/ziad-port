'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

const SERVICES = [
  {
    index: '01',
    title: 'Systems Architecture',
    short: 'Design before code.',
    body: 'Data models, service boundaries, API contracts, failure modes, and capacity planning — mapped before a line of production code. I deliver architectures teams can build on for years, with documentation that survives handover.',
    keywords: ['System Design', 'Multi-Tenant', 'Event-Driven', 'Capacity Planning'],
  },
  {
    index: '02',
    title: 'Cloud Infrastructure & DevOps',
    short: 'AWS · Docker · CI/CD.',
    body: 'Container orchestration, GitHub Actions pipelines, zero-downtime deploys, environment management. I build infrastructure your team can actually understand — and rebuild from a single repo.',
    keywords: ['AWS', 'Docker', 'GitHub Actions', 'Terraform'],
  },
  {
    index: '03',
    title: 'Distributed Backends & APIs',
    short: 'Services that survive traffic spikes.',
    body: 'Rate-limiting, idempotency keys, circuit breakers, JWT auth, connection pooling, caching strategies. Go and Django services engineered to fail gracefully instead of cascading.',
    keywords: ['Go', 'Django', 'Redis', 'REST', 'WebSockets'],
  },
  {
    index: '04',
    title: 'Reliability & Performance',
    short: "Find and fix what's slow.",
    body: 'Database query analysis, p95 latency hunting, caching architecture review, Core Web Vitals improvement. I find bottlenecks and eliminate them with evidence.',
    keywords: ['PostgreSQL', 'p95 Latency', 'Caching', 'Lighthouse'],
  },
  {
    index: '05',
    title: 'Full Stack Delivery',
    short: 'When the system needs a face.',
    body: 'Next.js front-ends, e-commerce with Stripe/Paystack, real-time dashboards — built on top of the architecture, not instead of it. From zero to production, end to end.',
    keywords: ['Next.js', 'React', 'Stripe', 'PostgreSQL'],
  },
];

/* ─── Toggle icon: two lines that morph into × ─────────────────────────── */
function ToggleIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-5 h-5 shrink-0">
      <motion.span
        className="absolute left-0 top-1/2 block w-5 h-px bg-white/50 origin-center"
        animate={{ rotate: open ? 45 : 0, y: open ? 0 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ translateY: '-50%' }}
      />
      <motion.span
        className="absolute left-0 top-1/2 block w-5 h-px bg-white/50 origin-center"
        animate={{ rotate: open ? -45 : 90 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{ translateY: '-50%' }}
      />
    </div>
  );
}

/* ─── Individual service row ─────────────────────────────────────────────── */
function ServiceRow({
  service,
  index,
  isOpen,
  hasOpenSibling,
  onToggle,
}: {
  service: typeof SERVICES[0];
  index: number;
  isOpen: boolean;
  hasOpenSibling: boolean;
  onToggle: () => void;
}) {
  const rowRef  = useRef<HTMLDivElement>(null);
  const inView  = useInView(rowRef, { once: true, margin: '-8%' });
  const [hovered, setHovered] = useState(false);

  const rawX   = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 380, damping: 32 });

  return (
    <motion.div
      ref={rowRef}
      animate={{ opacity: hasOpenSibling ? 0.35 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border-b border-white/8 relative overflow-hidden"
    >
      {/* Hover sweep background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
        }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -16 }}
        transition={{ duration: 0.35 }}
      />

      {/* Left accent bar — clips in on hover or open */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px bg-white/30 origin-top"
        animate={{ scaleY: hovered || isOpen ? 1 : 0, opacity: hovered || isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      />

      <button
        onClick={onToggle}
        onMouseEnter={() => { setHovered(true); rawX.set(10); }}
        onMouseLeave={() => { setHovered(false); rawX.set(0); }}
        className="w-full flex items-center justify-between py-6 lg:py-8 text-left pl-4 lg:pl-6"
      >
        {/* Content: index + title + short */}
        <motion.div
          style={{ x: springX }}
          className="flex items-baseline gap-6 lg:gap-10 flex-1 min-w-0"
        >
          {/* Index */}
          <motion.span
            className="text-[0.6rem] tracking-[0.2em] uppercase font-medium shrink-0 tabular-nums"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
            animate={{ color: hovered || isOpen ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.22)' }}
            transition={{ duration: 0.25 }}
          >
            {service.index}
          </motion.span>

          {/* Title — clips up from below on scroll-in */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-1 lg:gap-8 flex-1 min-w-0">
            <div className="overflow-hidden">
              <motion.h3
                className="font-black text-white tracking-[-0.035em] leading-none"
                style={{
                  fontFamily: 'Satoshi, system-ui, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)',
                }}
                initial={{ y: '110%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.75, delay: index * 0.09, ease: EASE }}
              >
                {service.title}
              </motion.h3>
            </div>

            {/* Short — fades out when open */}
            <motion.p
              className="text-white/35 text-sm lg:text-base hidden lg:block shrink-0"
              style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
              animate={{ opacity: isOpen ? 0 : hovered ? 0.6 : 0.35 }}
              transition={{ duration: 0.2 }}
            >
              {service.short}
            </motion.p>
          </div>
        </motion.div>

        <div className="ml-4">
          <ToggleIcon open={isOpen} />
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-10 pl-[calc(1rem+1.5rem+1.5rem)] lg:pl-[calc(1.5rem+2.5rem+2.5rem)] pr-4 lg:pr-6">

              {/* Body — word-by-word stagger */}
              <p
                className="text-white/50 leading-relaxed max-w-2xl mb-6"
                style={{
                  fontFamily: 'Satoshi, system-ui, sans-serif',
                  fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
                }}
              >
                {service.body.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.4, delay: i * 0.022, ease: EASE }}
                    style={{ display: 'inline-block', marginRight: '0.3em' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>

              {/* Keywords — staggered clip-path pop-in */}
              <div className="flex flex-wrap gap-2">
                {service.keywords.map((kw, i) => (
                  <motion.span
                    key={kw}
                    initial={{ opacity: 0, y: 10, clipPath: 'inset(100% 0 0 0)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
                    transition={{ duration: 0.4, delay: 0.12 + i * 0.07, ease: EASE }}
                    className="border border-white/15 text-white/35 text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1"
                    style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
                  >
                    {kw}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */
export function Services() {
  const sectionRef  = useRef<HTMLElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-12%' });

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* Scroll-scrub vertical progress line */
  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            end: 'bottom 35%',
            scrub: 1.5,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      data-theme="dark"
      className="w-full bg-[#0A0A0A] relative"
    >
      {/* Scroll-progress line — left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 hidden lg:block pointer-events-none">
        <div ref={lineRef} className="w-full h-full bg-white/20" />
      </div>

      <div className="max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(5rem,10vw,11rem)]">

        {/* Section label + animated divider */}
        <div className="flex items-center gap-4 mb-[clamp(3rem,6vw,7rem)]">
          <motion.span
            className="text-[0.6rem] tracking-[0.22em] uppercase text-white/20 font-medium shrink-0"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
            initial={{ opacity: 0, x: -16 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            03 / Services
          </motion.span>
          <motion.div
            className="flex-1 h-px bg-white/10"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={sectionInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
          />
        </div>

        {/* Headline — word-by-word clip reveal */}
        <h2
          className="font-black text-white tracking-[-0.04em] leading-[0.9] mb-[clamp(3rem,5vw,6rem)]"
          style={{
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 8rem)',
          }}
        >
          {(['What', 'I'] as const).map((word, i) => (
            <span key={word} className="inline-block overflow-hidden mr-[0.25em]">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={sectionInView ? { y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.05 + i * 0.1, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
          {' '}
          <span className="inline-block overflow-hidden">
            <motion.span
              className="block"
              style={{
                fontFamily: 'var(--font-instrument), Georgia, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.3)',
              }}
              initial={{ y: '110%' }}
              animate={sectionInView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            >
              Build
            </motion.span>
          </span>
        </h2>

        {/* Service rows */}
        <motion.div
          className="border-t border-white/8"
          initial={{ scaleX: 0, transformOrigin: 'left' }}
          animate={sectionInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          {SERVICES.map((service, i) => (
            <ServiceRow
              key={service.index}
              service={service}
              index={i}
              isOpen={openIndex === i}
              hasOpenSibling={openIndex !== null && openIndex !== i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
