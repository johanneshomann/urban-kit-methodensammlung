'use client'

import type { CategoryItem, FilterItem, Methode } from '@/types'
import { getLocalizedName } from '@/lib/localize'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@/navigation'
import { ChevronDown, SlidersHorizontal, Search, X, RotateCcw, Settings, LayoutGrid, Columns2, Rows3, Sparkles } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function ClearDot({ onClear, tooltip = 'Zurücksetzen' }: { onClear: (e: React.MouseEvent) => void; tooltip?: string }) {
  const [hovered, setHovered] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMouseEnter() {
    setHovered(true)
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    timerRef.current = setTimeout(() => {
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top })
    }, 550)
  }

  function handleMouseLeave() {
    setHovered(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    setTooltipPos(null)
  }

  return (
    <>
      <span
        ref={btnRef as React.RefObject<HTMLSpanElement>}
        role="button"
        tabIndex={0}
        onClick={onClear}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClear(e as unknown as React.MouseEvent) }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="shrink-0 relative flex items-center justify-center cursor-pointer"
        style={{ width: '1em', height: '1em', color: 'var(--method-accent)' }}
        aria-label="Filter zurücksetzen"
      >
        <span
          className="rounded-full block absolute"
          aria-hidden
          style={{
            background: 'var(--method-accent)',
            width: '0.4em',
            height: '0.4em',
            opacity: hovered ? 0 : 1,
            transform: hovered ? 'scale(0) rotate(90deg)' : 'scale(1) rotate(0deg)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        />
        <X
          className="absolute"
          style={{
            width: '0.85em',
            height: '0.85em',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-90deg)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        />
      </span>
      {tooltipPos && createPortal(
        <span
          className="tooltip-in pointer-events-none text-small whitespace-nowrap px-2.5 py-1 rounded-lg border"
          style={{
            position: 'fixed',
            left: tooltipPos.x,
            top: tooltipPos.y - 8,
            transform: 'translate(-50%, -100%)',
            background: 'var(--method-white-transparent)',
            color: 'var(--method-ink)',
            zIndex: 9999,
            backdropFilter: 'blur(6px)',
          }}
        >
          {tooltip}
        </span>,
        document.body
      )}
    </>
  )
}
function FilterPill({ icon, label, value, onClick }: {
  icon?: React.ReactNode
  label: string
  value: string
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-small transition-all cursor-pointer"
      style={{ color: 'var(--method-ink)' }}
    >
      {icon}
      <span>{label}:</span>
      <span>{value}</span>
      <X
        className="shrink-0 w-[1em] h-[1em]"
        style={{
          color: 'var(--method)',
          transform: hovered ? 'scale(1.2) rotate(90deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </button>
  )
}

import MethodCard from './MethodCard'
import MethodFilters from './MethodFilters'
import { EMPTY_FILTERS, FILTER_CONFIGS, type FilterKey, type FilterState } from '@/lib/filterConfig'

type Props = {
  methods: Methode[]
  filterIcons?: Record<string, string | undefined>
  filterLucideIcons?: Record<string, string | undefined>
  allFilterItems?: Record<FilterKey, FilterItem[]>
  allCategoryItems?: Partial<Record<FilterKey, CategoryItem[]>>
  activeFilterKeys?: Set<FilterKey>
  /** Show a button in the toolbar linking to the assistant page. */
  assistantEnabled?: boolean
}

function getItems(method: Methode, key: FilterKey): FilterItem[] {
  const raw = method[key]
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is FilterItem => typeof x === 'object' && x !== null)
}

function getNames(method: Methode, key: FilterKey, locale: string): string[] {
  return getItems(method, key).map((item) => getLocalizedName(item, locale)).filter(Boolean)
}


export default function FilterableMethodList({ methods, filterIcons, filterLucideIcons, allFilterItems, allCategoryItems, activeFilterKeys, assistantEnabled }: Props) {
  const t = useTranslations('methods')
  const tFilter = useTranslations('filter')
  const tAssistant = useTranslations('assistant')
  const locale = useLocale()

  const [filters, setFilters] = useState<FilterState>({ ...EMPTY_FILTERS })
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [gridCols, setGridCols] = useState<1 | 2 | 3>(3)
  const [showAuszug, setShowAuszug] = useState(true)

  const activeConfigs = useMemo(
    () => (activeFilterKeys ? FILTER_CONFIGS.filter((c) => activeFilterKeys.has(c.key)) : FILTER_CONFIGS),
    [activeFilterKeys],
  )

  const allOptions = useMemo(() => {
    const result = {} as Record<FilterKey, string[]>
    for (const { key } of activeConfigs) {
      if (allFilterItems?.[key]) {
        result[key] = allFilterItems[key].map((item) => getLocalizedName(item, locale)).filter(Boolean).sort()
      } else {
        const names = new Set<string>()
        for (const m of methods) for (const n of getNames(m, key, locale)) names.add(n)
        result[key] = [...names].sort()
      }
    }
    return result
  }, [methods, allFilterItems, locale, activeConfigs])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return methods.filter((m) => {
      if (q && !m.title.toLowerCase().includes(q)) return false
      return activeConfigs.every(({ key }) => {
        const selected = filters[key]
        if (selected.length === 0) return true
        return selected.some(s => getNames(m, key, locale).includes(s))
      })
    })
  }, [methods, filters, search, locale, activeConfigs])

  const availableOptions = useMemo(() => {
    const result = {} as Record<FilterKey, string[]>
    for (const { key } of activeConfigs) {
      const otherFilters = activeConfigs.filter((c) => c.key !== key)
      const subset = methods.filter((m) =>
        otherFilters.every(({ key: k }) => {
          const selected = filters[k]
          if (selected.length === 0) return true
          return selected.some(s => getNames(m, k, locale).includes(s))
        }),
      )
      const names = new Set<string>()
      for (const m of subset) for (const n of getNames(m, key, locale)) names.add(n)
      result[key] = [...names]
    }
    return result
  }, [methods, filters, locale, activeConfigs])

  const hasAnyActive = Object.values(filters).some(arr => arr.length > 0)

  const filterAreaRef = useRef<HTMLDivElement>(null)
  const settingsAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (filterAreaRef.current && !filterAreaRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filterOpen])

  useEffect(() => {
    if (!settingsOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (settingsAreaRef.current && !settingsAreaRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [settingsOpen])

  return (
    <div className="flex flex-col gap-3">

      {/* Search + Filter row + panel */}
      <div className="flex flex-col gap-2" ref={filterAreaRef}>
      <div className="flex gap-2">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl text-text shadow-sm hover:shadow-md transition-shadow" style={{ background: 'var(--method-white)' }}>
          <Search className="w-[1em] h-[1em] shrink-0 opacity-40" style={{ color: 'var(--method-ink)' }} />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Methode suchen …"
            className="flex-1 outline-none bg-transparent placeholder:opacity-40"
            style={{ color: 'var(--method-ink)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="opacity-40 hover:opacity-80 transition-opacity cursor-pointer">
              <X className="w-[1em] h-[1em]" style={{ color: 'var(--method-ink)' }} />
            </button>
          )}
        </div>

        {/* Filter toggle button */}
        <button
          type="button"
          onClick={() => setFilterOpen(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-display cursor-pointer shrink-0"
          style={{
            background: filterOpen ? 'var(--method-light)' : 'var(--method-white)',
            color: 'var(--method-ink)',
            minWidth: filterOpen ? '16rem' : '12rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            transition: 'background 0.2s, box-shadow 0.2s, min-width 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={e => { if (!filterOpen) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--method-light)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' } }}
          onMouseLeave={e => { if (!filterOpen) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--method-white)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' } }}
        >
          <SlidersHorizontal className="w-[1em] h-[1em] shrink-0" style={{ color: 'var(--method-ink)' }} />
          <span>{tFilter('label').replace(':', '')}</span>
          <span
            style={{
              display: 'inline-flex',
              overflow: 'hidden',
              maxWidth: hasAnyActive ? '1.5em' : '0',
              marginLeft: '-0.25em',
              transition: 'max-width 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <ClearDot tooltip="Alle zurücksetzen" onClear={(e) => { e.stopPropagation(); setFilters({ ...EMPTY_FILTERS }) }} />
          </span>
          <ChevronDown
            className={`w-[1em] h-[1em] shrink-0 ml-auto transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--method-ink)' }}
          />
        </button>

        {/* Assistant CTA → dedicated page */}
        {assistantEnabled && (
          <Link
            href="/assistant"
            className="shrink-0 self-stretch flex items-center gap-2 px-4 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md text-display"
            style={{ background: 'var(--method)', color: 'var(--method-white)' }}
            aria-label={tAssistant('title')}
            title={tAssistant('title')}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--method-dark)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--method)')}
          >
            <Sparkles className="w-[1em] h-[1em] shrink-0" />
            <span className="hidden lg:inline whitespace-nowrap">{tAssistant('title')}</span>
          </Link>
        )}

        {/* Settings button + popover */}
        <div className="relative shrink-0 self-stretch" ref={settingsAreaRef}>
          <button
            type="button"
            onClick={() => setSettingsOpen(v => !v)}
            className="h-full flex items-center justify-center px-3.5 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md text-display"
            style={{
              background: settingsOpen ? 'var(--method-light)' : 'var(--method-white)',
              color: 'var(--method-ink)',
            }}
            onMouseEnter={e => { if (!settingsOpen) (e.currentTarget as HTMLButtonElement).style.background = 'var(--method-light)' }}
            onMouseLeave={e => { if (!settingsOpen) (e.currentTarget as HTMLButtonElement).style.background = 'var(--method-white)' }}
            aria-label="Ansicht anpassen"
          >
            <Settings className="w-[1em] h-[1em]" />
          </button>

          {settingsOpen && (
            <div
              className="popover-in absolute right-0 top-full mt-2 rounded-xl p-3 flex flex-col gap-3 z-50"
              style={{ background: 'var(--method-white)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: '11rem' }}
            >
              {/* Grid columns */}
              <div className="flex flex-col gap-1.5">
                <span className="text-small opacity-50" style={{ color: 'var(--method-ink)' }}>Spalten</span>
                <div className="flex gap-1">
                  {([3, 2, 1] as const).map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setGridCols(n)}
                      className="flex-1 flex items-center justify-center p-2 rounded-lg transition-all cursor-pointer text-text"
                      style={{
                        background: gridCols === n ? 'var(--method)' : 'var(--method-light)',
                        color: gridCols === n ? 'var(--method-white)' : 'var(--method-ink)',
                      }}
                      aria-label={`${n} Spalte${n !== 1 ? 'n' : ''}`}
                    >
                      {n === 1 ? <Rows3 className="w-[1em] h-[1em]" /> : n === 2 ? <Columns2 className="w-[1em] h-[1em]" /> : <LayoutGrid className="w-[1em] h-[1em]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auszug toggle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-small opacity-50" style={{ color: 'var(--method-ink)' }}>Auszug</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowAuszug(true)}
                    className="flex-1 px-2 py-1.5 rounded-lg text-small transition-all cursor-pointer"
                    style={{
                      background: showAuszug ? 'var(--method)' : 'var(--method-light)',
                      color: showAuszug ? 'var(--method-white)' : 'var(--method-ink)',
                    }}
                  >
                    Anzeigen
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAuszug(false)}
                    className="flex-1 px-2 py-1.5 rounded-lg text-small transition-all cursor-pointer"
                    style={{
                      background: !showAuszug ? 'var(--method)' : 'var(--method-light)',
                      color: !showAuszug ? 'var(--method-white)' : 'var(--method-ink)',
                    }}
                  >
                    Ausblenden
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter panel */}
      <div
        className="rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        style={{
          display: 'grid',
          gridTemplateRows: filterOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s',
        }}
      >
        <div style={{ overflow: 'hidden', background: 'var(--method-white)' }}>
          <MethodFilters
            filters={filters}
            onChange={setFilters}
            onClearKey={(key) => setFilters(f => ({ ...f, [key]: [] }))}
            allOptions={allOptions}
            availableOptions={availableOptions}
            filterIcons={filterIcons}
            filterLucideIcons={filterLucideIcons}
            allFilterItems={allFilterItems}
            allCategoryItems={allCategoryItems}
            activeFilterKeys={activeFilterKeys}
            parentOpen={filterOpen}
          />
        </div>
      </div>
      </div>

      {/* Result count + active filter tags */}
      <div className="flex flex-col gap-1 pt-2">
        <p className="text-small font-medium" style={{ color: 'var(--method-ink)' }}>
          {filtered.length === 1 ? t('foundOne') : t('foundMany', { count: filtered.length })}
        </p>
        {hasAnyActive && (
          <div className="flex flex-wrap gap-1">
            {Object.values(filters).reduce((sum, arr) => sum + arr.length, 0) > 1 && (
              <FilterPill
                icon={<RotateCcw className="w-[1em] h-[1em]" aria-hidden />}
                label={locale === 'de' ? 'Alle' : 'All'}
                value={locale === 'de' ? 'zurücksetzen' : 'reset'}
                onClick={() => setFilters({ ...EMPTY_FILTERS })}
              />
            )}
            {activeConfigs.flatMap(({ key, de, en }) => {
              const values = filters[key]
              if (values.length === 0) return []
              const label = locale === 'de' ? de : en
              const lucideName = filterLucideIcons?.[key]
              const uploadUrl = filterIcons?.[key]
              const Icon = lucideName ? (LucideIcons as unknown as Record<string, LucideIcon>)[lucideName] : null
              const icon = uploadUrl
                ? <img src={uploadUrl} alt="" aria-hidden className="w-[1em] h-[1em] object-contain" />
                : Icon ? <Icon className="w-[1em] h-[1em]" aria-hidden /> : null

              return values.map(value => (
                <FilterPill
                  key={`${key}-${value}`}
                  icon={icon}
                  label={label}
                  value={value}
                  onClick={() => setFilters(f => ({ ...f, [key]: f[key].filter(v => v !== value) }))}
                />
              ))
            })}
          </div>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-display font-black mb-2" style={{ color: 'var(--method-ink-accent)' }}>
            {t('notFound')}
          </p>
          <p className="text-text" style={{ color: 'var(--method-ink)' }}>{t('adjustFilters')}</p>
        </div>
      ) : (
        <div
          key={`${search}|${Object.entries(filters).map(([k, v]) => `${k}:${(v as string[]).join(',')}`).join('|')}`}
          className={`grid gap-6 ${gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
        >
          {filtered.map((m, i) => (
            <div key={m.id} className="card-in" style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}>
              <MethodCard method={m} showAuszug={showAuszug} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
