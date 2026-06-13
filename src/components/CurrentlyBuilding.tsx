'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const EASE = [0.22, 1, 0.36, 1] as const;

const NOW = [
  { label: 'AI Inference', detail: 'YOLOv8-nano person & object detection' },
  { label: 'Thermal Sensing', detail: 'Pipeline leak detection layer' },
  { label: 'Protobuf', detail: 'DetectionEvent real-time schema' },
];

export function CurrentlyBuilding() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section
      ref={ref}
      data-theme="dark"
      className="w-full bg-[#0A0A0A] border-t border-white/6 relative overflow-hidden"
    >
      {/* moving scan line */}
      <motion.div
        aria-hidden
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.18), transparent)' }}
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(2.5rem,5vw,4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-8 lg:gap-12">

          {/* LIVE + label */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="inline-flex items-center gap-2 border border-emerald-400/25 px-3 py-1.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-400/50 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </span>
              <span
                className="text-[0.55rem] tracking-[0.24em] uppercase text-emerald-300/70 font-semibold"
                style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
              >
                Currently Building
              </span>
            </span>
            <div className="relative h-7 w-32 opacity-70 hidden sm:block">
              <Image src="/logo/NEXTGEN PL (Landscape) WHITE.png" alt="NextGen Robotics" fill className="object-contain object-left" />
            </div>
          </motion.div>

          {/* Orion description */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <p
              className="text-white/80"
              style={{ fontFamily: 'Satoshi, system-ui, sans-serif', fontSize: 'clamp(1rem,1.6vw,1.35rem)', fontWeight: 600 }}
            >
              Orion{' '}
              <span style={{ fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.45)' }}>
                — distributed AI surveillance, embedded edge to browser.
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {NOW.map((item) => (
                <span key={item.label} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
                  <span
                    className="text-[0.62rem] tracking-[0.05em] text-white/40"
                    style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
                  >
                    <span className="text-white/60">{item.label}</span> · {item.detail}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>

          {/* link */}
          <motion.a
            href="https://nextgenerationrobotics.org"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            className="group inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-200 shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <span className="text-[0.6rem] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
              View Live
            </span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
