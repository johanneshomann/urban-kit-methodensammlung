// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, usePathname } from '@/navigation'
import { useTranslations } from 'next-intl'
import { ChevronRight, Home, Bookmark, HeartHandshake, Mail, Signpost, Menu, X, Sparkles } from 'lucide-react'

const CLOSE_DURATION = 280
const CLOSE_DELAY = 220

export default function NavMenu({ assistantEnabled = false }: { assistantEnabled?: boolean }) {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const desktopBtnRef = useRef<HTMLButtonElement>(null)
  const mobileBtnRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  const openMenu = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setClosing(false)
    setOpen(true)
  }, [])

  const closeImmediate = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setClosing(true)
    timer.current = setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, CLOSE_DURATION)
  }, [])

  const closeDelayed = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setClosing(true)
      timer.current = setTimeout(() => {
        setOpen(false)
        setClosing(false)
      }, CLOSE_DURATION)
    }, CLOSE_DELAY)
  }, [])

  const cancelClose = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setClosing(false)
  }, [])

  // Keyboard activation (click with detail 0 = Enter/Space) moves focus into
  // the first menu link on open, so Tab continues through the links instead of
  // leaving the menu region and closing it.
  const pendingFocus = useRef(false)
  const handleTriggerClick = useCallback((e: React.MouseEvent) => {
    if (open && !closing) {
      closeImmediate()
      return
    }
    pendingFocus.current = e.detail === 0
    openMenu()
  }, [open, closing, closeImmediate, openMenu])

  const isOpen = open && !closing

  useEffect(() => {
    if (!open || !pendingFocus.current) return
    pendingFocus.current = false
    const links = rootRef.current?.querySelectorAll<HTMLElement>('a[href]')
    if (!links) return
    // Focus the first link of the panel that's actually displayed (desktop or mobile).
    for (const a of links) {
      if (a.offsetParent) {
        a.focus()
        break
      }
    }
  }, [open])

  // Close when focus lands outside the menu region. `focusin` on the document
  // is more reliable than blur/relatedTarget (which can be null mid-transition).
  useEffect(() => {
    if (!open) return
    const onFocusIn = (e: FocusEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeImmediate()
    }
    document.addEventListener('focusin', onFocusIn)
    return () => document.removeEventListener('focusin', onFocusIn)
  }, [open, closeImmediate])

  // Keyboard handling while open. Tab is managed manually because macOS
  // Safari/Firefox skip links in native Tab order (and Safari doesn't focus
  // buttons on click), which would otherwise tab straight OUT of the menu and
  // close it. Escape closes and refocuses the trigger; arrows are a bonus.
  useEffect(() => {
    if (!open) return

    const visibleTrigger = () =>
      desktopBtnRef.current?.offsetParent ? desktopBtnRef.current : mobileBtnRef.current
    const visibleLinks = () =>
      Array.from(rootRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? []).filter(
        (a) => a.offsetParent,
      )

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeImmediate()
        visibleTrigger()?.focus()
        return
      }
      if (e.key !== 'Tab' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

      // Only steer the keyboard when focus is in the menu region (or nowhere,
      // e.g. Safari after a click) — never hijack typing elsewhere on the page.
      const active = document.activeElement as HTMLElement | null
      const inRegion = !!active && !!rootRef.current?.contains(active)
      const unanchored = !active || active === document.body
      if (!inRegion && !unanchored) return

      const links = visibleLinks()
      if (links.length === 0) return
      const idx = active ? links.indexOf(active) : -1

      if (e.key === 'Tab' && !e.shiftKey) {
        if (idx === links.length - 1) {
          closeImmediate() // leaving past the last link — let focus move on
          return
        }
        e.preventDefault()
        links[idx + 1].focus() // idx -1 (trigger/nothing) → first link
      } else if (e.key === 'Tab' && e.shiftKey) {
        if (idx === -1) return // on the trigger: default back-tab; focusin closes
        e.preventDefault()
        if (idx === 0) visibleTrigger()?.focus()
        else links[idx - 1].focus()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        links[Math.min(idx + 1, links.length - 1)].focus()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (idx <= 0) visibleTrigger()?.focus()
        else links[idx - 1].focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeImmediate])

  const links = [
    { href: '/',            label: t('home'),              icon: Home },
    ...(assistantEnabled
      ? [{ href: '/assistant', label: t('assistant'), icon: Sparkles }]
      : []),
    { href: '/saved',       label: t('saved'),             icon: Bookmark },
    { href: '/hilfe',       label: t('help'),              icon: Signpost },
    { href: '/ueber',       label: t('ueber'),             icon: HeartHandshake },
    { href: '/kontakt',     label: t('contact'),           icon: Mail },
  ]

  return (
    <div ref={rootRef} className="contents">
      {/* Desktop: hover opens, click/Enter toggles */}
      <button
        ref={desktopBtnRef}
        onClick={handleTriggerClick}
        onMouseEnter={e => { openMenu(); e.currentTarget.style.color = 'var(--method-dark)'; }}
        onMouseLeave={e => { closeDelayed(); e.currentTarget.style.color = ''; }}
        aria-expanded={isOpen}
        className={`hidden md:flex items-center gap-1 text-text cursor-pointer transition-colors ${isOpen ? 'text-[var(--method)]' : 'text-[var(--method-ink)]'}`}
      >
        {t('menu')}
        <ChevronRight className={`text-text w-[1em] h-[1em] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>

      {/* Mobile: click only */}
      <button
        ref={mobileBtnRef}
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        className="md:hidden flex items-center cursor-pointer transition-colors"
        style={{ color: 'var(--method-ink)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--method-dark)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--method-ink)')}
      >
        <span className="relative w-5 h-5 shrink-0">
          <Menu className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} aria-hidden="true" />
          <X className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} aria-hidden="true" />
        </span>
      </button>

      {/* Backdrop */}
      {open && <div className="fixed top-14 inset-x-0 bottom-0 z-30" onClick={closeImmediate} />}

      {/* Desktop panel */}
      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={closeDelayed}
          className="hidden md:block fixed top-14 left-10 overflow-hidden z-50 w-max rounded-b-xl"
        >
          <div className={`${closing ? 'nav-panel-exit' : 'nav-panel-enter'} bg-method-white border border-t-0 rounded-b-xl shadow-md`}>
            <div className="px-6 py-6 flex flex-col gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeImmediate}
                    className={`flex items-center gap-2 py-1.5 text-text transition-colors ${active ? 'font-bold' : 'font-normal'}`}
                    style={{ color: active ? 'var(--method-ink-accent)' : 'var(--method-ink)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--method-dark)')}
                    onMouseLeave={e => (e.currentTarget.style.color = active ? 'var(--method-ink-accent)' : 'var(--method-ink)')}
                  >
                    <Icon className="text-text w-[1em] h-[1em] shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden fixed top-14 inset-x-0 z-40 overflow-hidden">
          <div className={`bg-method-white border-b shadow-md ${closing ? 'nav-panel-exit' : 'nav-panel-enter'}`}>
            <div className="px-6 py-4 flex flex-col gap-0">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeImmediate}
                    className={`flex items-center gap-2 py-2.5 text-text transition-colors ${active ? 'font-bold' : 'font-normal'}`}
                    style={{ color: active ? 'var(--method-ink-accent)' : 'var(--method-ink)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--method-dark)')}
                    onMouseLeave={e => (e.currentTarget.style.color = active ? 'var(--method-ink-accent)' : 'var(--method-ink)')}
                  >
                    <Icon className="text-text w-[1em] h-[1em] shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
