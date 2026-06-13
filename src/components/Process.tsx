'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    index: '01',
    title: 'Discovery',
    duration: 'Days 1–3',
    body: 'We start with the problem, not the tech. I map your goals, users, and constraints, then turn them into a scoped plan with clear deliverables — so you know exactly what you’re getting and when.',
    tags: ['Goals', 'Scope', 'Timeline'],
  },
  {
    index: '02',
    title: 'Architecture',
    duration: 'Week 1',
    body: 'I design the system before writing a line of production code — data models, API contracts, infrastructure, and security boundaries. The result is software that scales cleanly instead of collapsing under its own weight.',
    tags: ['System Design', 'Data Models', 'Security'],
  },
  {
    index: '03',
    title: 'Build & Ship',
    duration: 'Core sprint',
    body: 'Tight, visible iterations. You see working software early and often, with weekly check-ins and a live staging URL. Momentum over perfection — high-impact features first, polished relentlessly.',
    tags: ['Iterative', 'Weekly Demos', 'Staging'],
  },
  {
    index: '04',
    title: 'Launch & Support',
    duration: 'Go-live +',
    body: 'Zero-downtime deployment, performance tuning, and a hand-off you can actually maintain. I stay on after launch to monitor, fix, and extend — your platform keeps getting better, not stale.',
    tags: ['Deploy', 'Monitoring', 'Handover'],
  },
];

function Step({ step, i }: { step: typeof STEPS[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-12%' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
      className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 md:gap-10 py-[clamp(2rem,4vw,3.5rem)] border-b border-white/8 group"
    >
      {/* node + index */}
      <div className="flex items-center md:items-start gap-4 md:w-44">
        <span className="relative flex w-2.5 h-2.5 mt-1 shrink-0">
          <motion.span
            className="absolute inset-0 rounded-full bg-white/30"
            animate={inView ? { scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] } : {}}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
          <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
        </span>
        <div>
          <span
            className="block font-black text-white/85 leading-none tabular-nums"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem,4vw,3.2rem)' }}
          >
            {step.index}
          </span>
          <span
            className="block mt-2 text-[0.55rem] tracking-[0.2em] uppercase text-white/30 font-medium"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
          >
            {step.duration}
          </span>
        </div>
      </div>

      {/* content */}
      <div>
        <h3
          className="font-black text-white tracking-[-0.03em] leading-none mb-4 group-hover:text-white transition-colors"
          style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontWeight: 800, fontSize: 'clamp(1.6rem,4vw,3rem)' }}
        >
          {step.title}
        </h3>
        <p
          className="text-white/50 leading-relaxed max-w-2xl mb-6"
          style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: 'clamp(0.95rem,1.4vw,1.1rem)' }}
        >
          {step.body}
        </p>
        <div className="flex flex-wrap gap-2">
          {step.tags.map((tag) => (
            <span
              key={tag}
              className="border border-white/12 text-white/35 text-[0.55rem] tracking-[0.14em] uppercase px-2.5 py-1"
              style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-12%' });

  return (
    <section
      ref={sectionRef}
      id="process"
      data-theme="dark"
      className="w-full bg-[#0A0A0A] border-t border-white/6 relative"
    >
      <div className="max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(5rem,10vw,11rem)]">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-[clamp(2.5rem,5vw,5rem)]">
          <motion.span
            className="text-[0.6rem] tracking-[0.22em] uppercase text-white/20 font-medium shrink-0"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
            initial={{ opacity: 0, x: -16 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            04 / Process
          </motion.span>
          <motion.div
            className="flex-1 h-px bg-white/10"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={sectionInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
          />
        </div>

        {/* Headline + intro */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-end mb-[clamp(3rem,6vw,6rem)]">
          <h2
            className="font-black text-white tracking-[-0.04em] leading-[0.9]"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontWeight: 800, fontSize: 'clamp(2.6rem,6.5vw,7.5rem)' }}
          >
            {(['How', 'I'] as const).map((word, i) => (
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
                Work
              </motion.span>
            </span>
          </h2>

          <motion.p
            className="text-white/45 leading-relaxed"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: 'clamp(1rem,1.4vw,1.2rem)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            Hiring an architect shouldn’t feel like a gamble. Here’s the exact, predictable path
            from first conversation to a launched, maintainable product — no disappearing acts.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="border-t border-white/8">
          {STEPS.map((step, i) => (
            <Step key={step.index} step={step} i={i} />
          ))}
        </div>

        {/* Availability reminder */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-[clamp(2.5rem,5vw,4rem)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-white/10 bg-white/[0.02] p-[clamp(1.5rem,3vw,2.5rem)]"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
            </span>
            <p
              className="text-white/70"
              style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: 'clamp(0.9rem,1.4vw,1.15rem)' }}
            >
              Currently accepting new projects —{' '}
              <span style={{ fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>
                limited slots this quarter.
              </span>
            </p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
            data-cursor="hire"
            className="group inline-flex items-center gap-3 border border-white/20 px-7 py-3.5 text-white/65 hover:text-white hover:border-white/50 hover:bg-white/[0.04] transition-colors duration-300 shrink-0"
          >
            <span className="text-[0.62rem] tracking-[0.22em] uppercase font-medium" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
              Start a Project
            </span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
