'use client'

import { useState, useRef, useCallback } from 'react'
import { Link, usePathname } from '@/navigation'
import { useTranslations } from 'next-intl'
import { ChevronRight, Home, Bookmark, Mail, Signpost, Menu, X } from 'lucide-react'

const CLOSE_DURATION = 280
const CLOSE_DELAY = 220

export default function NavMenu() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
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

  const toggle = useCallback(() => {
    if (open && !closing) closeImmediate()
    else openMenu()
  }, [open, closing, closeImmediate, openMenu])

  const isOpen = open && !closing

  const links = [
    { href: '/',            label: t('home'),              icon: Home },
    { href: '/saved',       label: t('saved'),             icon: Bookmark },
    { href: '/hilfe',       label: t('help'),              icon: Signpost },
    { href: '/kontakt',     label: t('contact'),           icon: Mail },
  ]

  return (
    <>
      {/* Desktop: hover opens, click toggles */}
      <button
        onClick={openMenu}
        onMouseEnter={e => { openMenu(); e.currentTarget.style.color = 'var(--method)'; }}
        onMouseLeave={e => { closeDelayed(); e.currentTarget.style.color = ''; }}
        aria-expanded={isOpen}
        className={`hidden md:flex items-center gap-1 text-text cursor-pointer transition-colors ${isOpen ? 'text-[var(--method)]' : 'text-[var(--method-ink)]'}`}
      >
        {t('menu')}
        <ChevronRight className={`text-text w-[1em] h-[1em] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>

      {/* Mobile: click only */}
      <button
        onClick={toggle}
        aria-expanded={isOpen}
        className="md:hidden flex items-center cursor-pointer transition-colors"
        style={{ color: 'var(--method-ink)' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--method)')}
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
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--method)')}
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
                    className={`flex items-center gap-2 py-2 text-text transition-colors ${active ? 'font-bold' : 'font-normal'}`}
                    style={{ color: active ? 'var(--method-ink-accent)' : 'var(--method-ink)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--method)')}
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
    </>
  )
}
