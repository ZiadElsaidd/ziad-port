'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, ArrowUpRight } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface Suggestion { label: string; query: string; }

/* Pool of client-intent prompts — a fresh set of 4 is shuffled in over time */
const SUGGESTION_POOL: Suggestion[] = [
  { label: 'Available right now?',     query: 'Is Ziad Elsaid available to start a new project right now?' },
  { label: 'How do you engage?',       query: 'How does Ziad Elsaid structure engagements — contract, rates, and timelines?' },
  { label: 'Work in my timezone?',     query: 'Can he work remotely across my timezone, and how does he communicate?' },
  { label: 'Built something like X?',  query: 'Has he built something similar to what I need? What are his most relevant projects?' },
  { label: 'AI & computer vision?',    query: 'Has Ziad Elsaid built AI, computer vision, or embedded systems?' },
  { label: 'Regulated industries?',    query: 'Does he have experience with HIPAA or other regulated, compliance-heavy industries?' },
  { label: 'How fast can you ship?',   query: 'How quickly can Ziad Elsaid deliver a typical project?' },
  { label: 'His strongest work?',      query: 'What are Ziad Elsaid’s strongest, most impressive projects?' },
  { label: 'What’s his stack?',        query: 'What technologies and stack does Ziad Elsaid specialise in?' },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Pick 4 fresh suggestions that don't overlap the currently shown set */
function freshSuggestions(prev: Suggestion[]): Suggestion[] {
  const shown = new Set(prev.map((s) => s.query));
  const rest = shuffle(SUGGESTION_POOL.filter((s) => !shown.has(s.query)));
  const picked = rest.slice(0, 4);
  return picked.length === 4 ? picked : shuffle(SUGGESTION_POOL).slice(0, 4);
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function MessageContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontSize: '0.82rem',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.58)',
            margin: 0,
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            display: 'block',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.1, delay: i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <span
        style={{
          fontFamily: 'Satoshi, system-ui, sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)',
          marginLeft: '0.25rem',
        }}
      >
        thinking
      </span>
    </div>
  );
}

function CornerAccents() {
  const line = 'rgba(255,255,255,0.18)';
  const size = 14;
  return (
    <>
      {/* top-left */}
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: size, background: line }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: size, height: 1, background: line }} />
      </div>
      {/* top-right */}
      <div style={{ position: 'absolute', top: 0, right: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 1, height: size, background: line }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: size, height: 1, background: line }} />
      </div>
      {/* bottom-left */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1, height: size, background: line }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: size, height: 1, background: line }} />
      </div>
      {/* bottom-right */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: size, background: line }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: size, height: 1, background: line }} />
      </div>
    </>
  );
}

export function AIAssistant() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [streaming, setStreaming] = useState(false);
  const [showSugg, setShowSugg]   = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => SUGGESTION_POOL.slice(0, 4));
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const abortRef  = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
  }, [open]);

  /* Shuffle a fresh set of suggestions on open, then rotate every 5s while idle */
  useEffect(() => {
    if (!open || messages.length > 0 || !showSugg) return;
    const id = setInterval(() => setSuggestions((prev) => freshSuggestions(prev)), 5000);
    return () => clearInterval(id);
  }, [open, messages.length, showSugg]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const close = () => {
    setOpen(false);
    abortRef.current?.abort();
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setShowSugg(false);
    setInput('');

    const next: Message[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setStreaming(true);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
        signal: abort.signal,
      });

      // Check for errors first
      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        let errorMsg = 'Request failed';
        
        if (contentType?.includes('application/json')) {
          try {
            const errorData = await res.json();
            errorMsg = errorData.error || errorMsg;
          } catch {}
        }
        
        throw new Error(errorMsg);
      }

      if (!res.body) throw new Error('No response body');

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let currentReply = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const newReply = currentReply + chunk;
        currentReply = newReply;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: newReply };
          return updated;
        });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "Something went wrong on my end. Please try again." },
        ]);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  return (
    <>
      {/* ── Trigger button ──────────────────────────────────────────────────── */}
      <motion.button
        data-cursor="ask"
        onClick={() => setOpen(true)}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-3 text-white"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '0.7rem 1.1rem',
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5, duration: 0.6, ease: EASE }}
        whileHover={{ borderColor: 'rgba(255,255,255,0.28)' }}
        aria-label="Open AI Assistant"
      >
        {/* Pulse dot */}
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 6, height: 6 }}>
          <motion.span
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
            }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', display: 'block' }} />
        </span>

        <Sparkles size={11} style={{ color: 'rgba(255,255,255,0.45)' }} />

        <span
          style={{
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          Ask AI
        </span>
      </motion.button>

      {/* ── Chat panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            />

            {/* Panel */}
            <motion.div
              data-theme="dark"
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                zIndex: 70,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: 'min(640px, 88dvh)',
                background: '#090909',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
              className="sm:bottom-8 sm:left-8 sm:w-112.5"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.97 }}
              transition={{ duration: 0.38, ease: EASE }}
            >
              <CornerAccents />

              {/* Subtle top highlight */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, transparent)', pointerEvents: 'none' }} />

              {/* ── Header ────────────────────────────────────────────────── */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Icon box */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.03)',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={12} style={{ color: 'rgba(255,255,255,0.45)' }} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <p
                        style={{
                          fontFamily: 'Satoshi, system-ui, sans-serif',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.18em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.82)',
                          margin: 0,
                        }}
                      >
                        Cybersage AI
                      </p>
                      {/* Live dot */}
                      <span style={{ position: 'relative', display: 'inline-flex', width: 5, height: 5 }}>
                        <motion.span
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            background: 'rgba(160,255,160,0.4)',
                          }}
                          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7dff7d', display: 'block' }} />
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: 'Satoshi, system-ui, sans-serif',
                        fontSize: '0.5rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.2)',
                        margin: 0,
                        marginTop: 2,
                      }}
                    >
                      Ask anything about Ziad Elsaid
                    </p>
                  </div>
                </div>

                <button
                  onClick={close}
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.09)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.28)',
                    cursor: 'pointer',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.28)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                  }}
                >
                  <X size={11} />
                </button>
              </div>

              {/* ── Messages ──────────────────────────────────────────────── */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  minHeight: 0,
                }}
              >
                {/* Welcome state */}
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    {/* Welcome message */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <p
                        style={{
                          fontFamily: 'Satoshi, system-ui, sans-serif',
                          fontSize: '0.95rem',
                          lineHeight: 1.65,
                          color: 'rgba(255,255,255,0.55)',
                          margin: 0,
                        }}
                      >
                        Hello. I&apos;m Ziad Elsaid&apos;s AI assistant — I know his full engineering history, every project he&apos;s shipped, and what he&apos;s currently building.
                      </p>
                      <p
                        style={{
                          fontFamily: 'Satoshi, system-ui, sans-serif',
                          fontSize: '0.95rem',
                          lineHeight: 1.65,
                          color: 'rgba(255,255,255,0.28)',
                          margin: '0.6rem 0 0',
                        }}
                      >
                        What would you like to know?
                      </p>
                    </div>

                    {/* Suggestion grid */}
                    <AnimatePresence>
                      {showSugg && (
                        <motion.div
                          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: 0.15, duration: 0.35 }}
                        >
                          <AnimatePresence mode="popLayout" initial={false}>
                            {suggestions.map((s, i) => (
                              <motion.button
                                key={s.query}
                                layout
                                onClick={() => send(s.query)}
                                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                                transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '0.5rem',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  background: 'rgba(255,255,255,0.02)',
                                  padding: '0.65rem 0.75rem',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: 'Satoshi, system-ui, sans-serif',
                                    fontSize: '0.65rem',
                                    letterSpacing: '0.03em',
                                    color: 'rgba(255,255,255,0.42)',
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {s.label}
                                </span>
                                <ArrowUpRight size={9} style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                              </motion.button>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Message thread */}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: 'flex',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      gap: '0.65rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    {msg.role === 'assistant' && (
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          border: '1px solid rgba(255,255,255,0.09)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 2,
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <Sparkles size={9} style={{ color: 'rgba(255,255,255,0.35)' }} />
                      </div>
                    )}

                    <div
                      style={{
                        maxWidth: '88%',
                        ...(msg.role === 'user'
                          ? {
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.09)',
                              padding: '0.6rem 0.9rem',
                              fontFamily: 'Satoshi, system-ui, sans-serif',
                              fontSize: '0.8rem',
                              lineHeight: 1.65,
                              color: 'rgba(255,255,255,0.75)',
                            }
                          : {}),
                      }}
                    >
                      {msg.role === 'assistant' ? (
                        msg.content === '' ? (
                          <TypingIndicator />
                        ) : (
                          <MessageContent content={msg.content} />
                        )
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}

                <div ref={bottomRef} />
              </div>

              {/* ── Input ─────────────────────────────────────────────────── */}
              <div
                style={{
                  padding: '0.85rem 1.25rem 1rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid rgba(255,255,255,0.09)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={() => {}}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
                    placeholder="Ask about skills, projects, availability…"
                    disabled={streaming}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      padding: '0.75rem 1rem',
                      fontFamily: 'Satoshi, system-ui, sans-serif',
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.7)',
                      letterSpacing: '0.01em',
                    }}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || streaming}
                    style={{
                      width: 38,
                      height: 38,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      border: 'none',
                      color: input.trim() && !streaming ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)',
                      cursor: input.trim() && !streaming ? 'pointer' : 'default',
                      flexShrink: 0,
                      transition: 'color 0.2s',
                    }}
                  >
                    <Send size={12} />
                  </button>
                </div>

                <p
                  style={{
                    fontFamily: 'Satoshi, system-ui, sans-serif',
                    fontSize: '0.46rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.12)',
                    textAlign: 'center',
                    marginTop: '0.5rem',
                  }}
                >
                  Powered by Claude · Anthropic
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
