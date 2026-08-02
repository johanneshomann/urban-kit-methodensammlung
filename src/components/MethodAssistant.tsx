// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { Send } from 'lucide-react'
import Markdown from 'react-markdown'
import type { Methode } from '@/types'
import MethodCard from './MethodCard'

type Msg = { role: 'user' | 'assistant'; content: string; methods?: Methode[] }

/**
 * What actually goes into sessionStorage: method CARDS are stored as ids only.
 * The full documents (depth 2, all rich text + galleries) are far too large —
 * a few of them exceed the ~5 MB quota, setItem throws, and the whole
 * transcript silently stops persisting. Ids are rehydrated on restore.
 */
type StoredMsg = { role: 'user' | 'assistant'; content: string; methodIds?: string[] }

const CHAT_STORAGE_KEY = 'uk-assistant-chat'

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
}: {
  enabled: boolean
  greeting?: string
}) {
  const t = useTranslations('assistant')
  const locale = useLocale()
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  // Holds the message KEY ('error' | 'errorRate'), not the text — rendered via
  // t.rich so the message can embed a link to the manual filter search.
  const [error, setError] = useState<'error' | 'errorRate' | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  // Blocks the persist effect until the stored transcript has been restored,
  // so the initial empty/partial state can never overwrite it.
  const hydratedRef = useRef(false)

  // Auto-grow the composer with its content (capped via CSS max-height) so
  // longer messages wrap into view instead of scrolling on one line.
  function resizeInput() {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  // Restore the transcript from this browser session on mount (survives
  // navigating away and back; cleared when the tab closes — documented in the
  // cookie policy as uk-assistant-chat). Falls back to seeding the greeting.
  //
  // Runs ONCE: the state it sets would otherwise re-trigger this effect, whose
  // cleanup would cancel the in-flight fetch. It also sets messages a single
  // time (with the cards already attached), because an intermediate text-only
  // state would make the persist effect below write the transcript back
  // WITHOUT the method ids — losing them permanently.
  useEffect(() => {
    let cancelled = false
    const finish = (msgs: Msg[]) => {
      if (cancelled) return
      setMessages(msgs)
      hydratedRef.current = true
    }

    let stored: StoredMsg[] = []
    try {
      const raw = sessionStorage.getItem(CHAT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          stored = parsed.filter(
            (m): m is StoredMsg =>
              !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
          )
        }
      }
    } catch { /* storage blocked or corrupt — start fresh */ }

    if (stored.length === 0) {
      finish([{ role: 'assistant', content: greeting?.trim() || t('greeting') }])
      return
    }

    const textOnly: Msg[] = stored.map(({ role, content }) => ({ role, content }))
    const ids = [...new Set(stored.flatMap((m) => m.methodIds ?? []))]
    if (ids.length === 0) {
      finish(textOnly)
      return
    }

    // Rehydrate the cards (one request for the whole transcript), then render.
    fetch(`/api/methods-by-ids?ids=${ids.join(',')}&locale=${locale}`)
      .then((r) => r.json())
      .then((data) => {
        const byId = new Map<string, Methode>(
          ((data?.docs ?? []) as Methode[]).map((d) => [String(d.id), d]),
        )
        finish(
          stored.map(({ role, content, methodIds }) => {
            const methods = methodIds?.map((id) => byId.get(id)).filter(Boolean) as Methode[] | undefined
            return { role, content, ...(methods?.length ? { methods } : {}) }
          }),
        )
      })
      .catch(() => finish(textOnly)) // cards missing, conversation text intact

    return () => { cancelled = true }
  }, [])

  // Persist the transcript for the session (ids only — see StoredMsg).
  useEffect(() => {
    if (!hydratedRef.current || messages.length === 0) return
    const toStore: StoredMsg[] = messages.map(({ role, content, methods }) => ({
      role,
      content,
      ...(methods?.length ? { methodIds: methods.map((m) => String(m.id)) } : {}),
    }))
    try { sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toStore)) } catch { /* ignore */ }
  }, [messages])

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
    requestAnimationFrame(resizeInput) // shrink the composer back after clearing
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

  const composerControls = (
    <>
      <textarea
        ref={inputRef}
        value={input}
        rows={1}
        onChange={(e) => { setInput(e.target.value); resizeInput() }}
        onKeyDown={(e) => {
          // Enter sends; Shift+Enter inserts a line break.
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
        placeholder={t('placeholder')}
        maxLength={2000}
        className="flex-1 outline-none bg-transparent text-text placeholder:opacity-40 resize-none overflow-y-auto max-h-32 leading-relaxed"
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

  // Fade the transcript's top & bottom edges so bubbles ease in/out of view as
  // they scroll (mirrors the section fade). ~one bubble tall.
  const FADE = '1rem'
  const fadeMask = `linear-gradient(to bottom, transparent 0, #000 ${FADE}, #000 calc(100% - ${FADE}), transparent 100%)`

  const transcript = (
    <div
      ref={scrollRef}
      style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
      className="overflow-y-auto flex flex-col flex-1 min-h-0 py-6 gap-6"
    >
      {messages.map((m, i) => (
        <div key={i} className="flex flex-col gap-3">
          {m.role === 'user' ? (
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
          )}

          {m.methods && m.methods.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {m.methods.map((method) => (
                <MethodCard key={method.id} method={method} showAuszug background="var(--method-white)" />
              ))}
            </div>
          )}
        </div>
      ))}

      {loading && (
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
      )}

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

  // Seamless layout: messages on the page, composer pinned at the bottom.
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
