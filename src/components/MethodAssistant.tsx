// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Sparkles, Send, ChevronDown } from 'lucide-react'
import Markdown from 'react-markdown'
import type { Methode } from '@/types'
import MethodCard from './MethodCard'

type Msg = { role: 'user' | 'assistant'; content: string; methods?: Methode[] }

/** Renders the assistant's Markdown (bold, lists, headings). Styling in globals.css (.chat-md). */
function ChatMarkdown({ children }: { children: string }) {
  return (
    <div className="chat-md">
      <Markdown>{children}</Markdown>
    </div>
  )
}

export default function MethodAssistant({
  enabled,
  greeting,
  variant = 'inline',
}: {
  enabled: boolean
  greeting?: string
  /** 'inline' = collapsible accordion (home page). 'page' = always-open, full-height (dedicated page). */
  variant?: 'inline' | 'page'
}) {
  const t = useTranslations('assistant')
  const locale = useLocale()
  const isPage = variant === 'page'

  const [open, setOpen] = useState(isPage)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  // Holds the message KEY ('error' | 'errorRate'), not the text — rendered via
  // t.rich so the message can embed a link to the manual filter search.
  const [error, setError] = useState<'error' | 'errorRate' | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Seed the greeting once, when first opened.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: greeting?.trim() || t('greeting') }])
    }
  }, [open, messages.length, t, greeting])

  // Always follow the conversation — jump to the newest message (and the typing
  // indicator) so the user never misses a reply.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    setError(null)
    const next: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/method-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          // Only the window the server forwards to the model anyway (it slices
          // to the last 8 and REJECTS >16) — sending the full history would
          // permanently break the chat after ~8 exchanges.
          messages: next.slice(-8).map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!res.ok) {
        setError(res.status === 429 ? 'errorRate' : 'error')
        return
      }

      const data = (await res.json()) as { reply: string; methods: Methode[] }
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.reply, methods: data.methods },
      ])
    } catch {
      setError('error')
    } finally {
      setLoading(false)
    }
  }

  if (!enabled) return null

  const headerInner = (
    <>
      <span
        className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
        style={{ background: 'var(--method-light)', color: 'var(--method-dark)' }}
      >
        <Sparkles className="w-[1.1em] h-[1.1em]" />
      </span>
      <span className="flex flex-col flex-1 min-w-0">
        <span className="text-display font-bold leading-tight" style={{ color: 'var(--method-ink-accent)' }}>
          {t('title')}
        </span>
        <span className="text-small opacity-60" style={{ color: 'var(--method-ink)' }}>
          {t('subtitle')}
        </span>
      </span>
      {!isPage && (
        <ChevronDown
          className={`w-[1.2em] h-[1.2em] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--method-ink)' }}
        />
      )}
    </>
  )

  const composerControls = (
    <>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send() } }}
        placeholder={t('placeholder')}
        maxLength={2000}
        className="flex-1 outline-none bg-transparent text-text placeholder:opacity-40"
        style={{ color: 'var(--method-ink)' }}
      />
      <button
        type="button"
        onClick={send}
        disabled={loading || !input.trim()}
        className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-opacity disabled:opacity-30 cursor-pointer disabled:cursor-default"
        style={{ background: 'var(--method)', color: 'var(--method-on-brand)' }}
        aria-label={t('send')}
      >
        <Send className="w-[1em] h-[1em]" />
      </button>
    </>
  )

  const privacyNotice = (
    <p className="text-small opacity-60" style={{ color: 'var(--method-ink)' }}>
      {t.rich('privacyNotice', {
        link: (chunks) => (
          <Link href="/datenschutz" className="underline hover:opacity-100 transition-opacity">
            {chunks}
          </Link>
        ),
      })}
      {' · '}
      <Link href="/impressum" className="underline hover:opacity-100 transition-opacity">
        {t('imprint')}
      </Link>
    </p>
  )

  // Page variant: fade the transcript's top & bottom edges so bubbles ease in/out
  // of view as they scroll (mirrors the section fade). ~one bubble tall.
  const FADE = '1rem'
  const fadeMask = `linear-gradient(to bottom, transparent 0, #000 ${FADE}, #000 calc(100% - ${FADE}), transparent 100%)`
  const maskStyle = isPage ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : undefined

  // Shared transcript + composer, rendered for both variants.
  const transcript = (
    <div
      ref={scrollRef}
      style={maskStyle}
      className={`overflow-y-auto flex flex-col ${isPage ? 'flex-1 min-h-0 py-6 gap-6' : 'max-h-[26rem] px-5 py-4 gap-4'}`}
    >
      {messages.map((m, i) => (
        <div key={i} className="flex flex-col gap-3">
          {isPage ? (
            m.role === 'user' ? (
              <div className="flex justify-end">
                <div
                  className="max-w-[80%] md:max-w-[calc(80%-60px)] px-4 py-2.5 rounded-2xl whitespace-pre-wrap text-text shadow-sm"
                  style={{ background: 'var(--method-white)', color: 'var(--method-ink)' }}
                >
                  {m.content}
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div
                  className="max-w-[80%] md:max-w-[calc(80%-60px)] px-4 py-2.5 rounded-2xl text-text shadow-sm"
                  style={{ background: 'var(--method-light)', color: 'var(--method-ink-accent)' }}
                >
                  <ChatMarkdown>{m.content}</ChatMarkdown>
                </div>
              </div>
            )
          ) : (
            <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`text-text max-w-[85%] px-4 py-2.5 rounded-2xl ${m.role === 'user' ? 'whitespace-pre-wrap' : ''}`}
                style={{
                  background: m.role === 'user' ? 'var(--method)' : 'var(--method-light)',
                  color: m.role === 'user' ? 'var(--method-on-brand)' : 'var(--method-ink)',
                }}
              >
                {m.role === 'user' ? m.content : <ChatMarkdown>{m.content}</ChatMarkdown>}
              </div>
            </div>
          )}

          {m.methods && m.methods.length > 0 && (
            <div className={`grid grid-cols-1 gap-4 ${isPage ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {m.methods.map((method) => (
                <MethodCard
                  key={method.id}
                  method={method}
                  showAuszug
                  background={isPage ? 'var(--method-white)' : 'var(--method-very-light)'}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {loading &&
        (isPage ? (
          <div className="flex justify-start">
            <div
              className="inline-flex gap-1 px-4 py-2.5 rounded-2xl text-text shadow-sm"
              style={{ background: 'var(--method-light)', color: 'var(--method-ink-accent)' }}
            >
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: '120ms' }}>·</span>
              <span className="animate-bounce" style={{ animationDelay: '240ms' }}>·</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-start">
            <div
              className="text-text px-4 py-2.5 rounded-2xl"
              style={{ background: 'var(--method-light)', color: 'var(--method-ink)' }}
            >
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '120ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '240ms' }}>·</span>
              </span>
            </div>
          </div>
        ))}

      {error && (
        <p className="text-small" style={{ color: 'var(--method-dark)' }}>
          {t.rich(error, {
            link: (chunks) => (
              <Link href="/#methods" className="underline hover:opacity-70 transition-opacity">
                {chunks}
              </Link>
            ),
          })}
        </p>
      )}
    </div>
  )

  // Page variant: seamless — no card, messages on the page, input pinned at the bottom.
  if (isPage) {
    return (
      <div className="flex flex-col h-full min-h-0">
        {transcript}
        <div className="shrink-0 pt-4">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-sm focus-within:ring-2"
            style={{ background: 'var(--method-white)', '--tw-ring-color': 'var(--method-dark)' } as React.CSSProperties}
          >
            {composerControls}
          </div>
          <div className="mt-2 text-center">{privacyNotice}</div>
        </div>
      </div>
    )
  }

  // Inline variant: collapsible card.
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--method-white)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left"
        aria-expanded={open}
      >
        {headerInner}
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ borderTop: '1px solid color-mix(in oklab, var(--method-ink) 12%, transparent)' }}>
            {transcript}
            <div
              className="flex items-center gap-2 px-4 py-3 focus-within:ring-2 focus-within:ring-inset"
              style={{ borderTop: '1px solid color-mix(in oklab, var(--method-ink) 12%, transparent)', '--tw-ring-color': 'var(--method-dark)' } as React.CSSProperties}
            >
              {composerControls}
            </div>
            <div className="px-4 pb-3">{privacyNotice}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
