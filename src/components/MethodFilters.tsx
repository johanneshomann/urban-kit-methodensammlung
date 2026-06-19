'use client'

import { useLocale } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown, X } from 'lucide-react'

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
          aria-hidden
          className="rounded-full block absolute"
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
          aria-hidden
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
import { FILTER_CONFIGS, EMPTY_FILTERS, type FilterKey, type FilterState } from '@/lib/filterConfig'
import type { CategoryItem, FilterItem } from '@/types'
import { getLocalizedName } from '@/lib/localize'
export type { FilterKey, FilterState } from '@/lib/filterConfig'
export { FILTER_CONFIGS, EMPTY_FILTERS }

function FilterIcon({ uploadUrl, lucideName, className }: { uploadUrl?: string; lucideName?: string; className?: string }) {
  if (uploadUrl) return <img src={uploadUrl} alt="" aria-hidden className={className ?? 'w-3.5 h-3.5 object-contain'} />
  if (lucideName) {
    const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[lucideName]
    if (Icon) return <Icon className={className ?? 'w-3.5 h-3.5'} aria-hidden />
  }
  return null
}

type Props = {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onClearKey?: (key: FilterKey) => void
  availableOptions: Record<FilterKey, string[]>
  allOptions: Record<FilterKey, string[]>
  filterIcons?: Record<string, string | undefined>
  filterLucideIcons?: Record<string, string | undefined>
  allFilterItems?: Record<FilterKey, FilterItem[]>
  allCategoryItems?: Partial<Record<FilterKey, CategoryItem[]>>
  activeFilterKeys?: Set<FilterKey>
  parentOpen?: boolean
}

function getCategoryId(category: CategoryItem | string | null | undefined): string | null {
  if (!category) return null
  if (typeof category === 'string') return category
  return category.id
}

function getItemIcon(item: FilterItem) {
  const uploadUrl = typeof item.icon === 'object' && item.icon ? item.icon.url ?? undefined : undefined
  return <FilterIcon uploadUrl={uploadUrl} lucideName={item.lucideIcon ?? undefined} className="w-[1em] h-[1em] object-contain shrink-0" />
}

function Chip({ label, icon, isActive, isAvailable, onClick }: {
  label: string
  icon?: React.ReactNode
  isActive: boolean
  isAvailable: boolean
  onClick: () => void
}) {
  const unavailable = !isActive && !isAvailable
  const btnRef = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMouseEnter() {
    setHovered(true)
    if (!unavailable || !btnRef.current) return
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
      <button
        ref={btnRef}
        type="button"
        onClick={unavailable ? undefined : onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-text border transition-all"
        style={
          isActive
            ? {
                background: hovered ? 'var(--method-dark)' : 'var(--method)',
                color: 'var(--method-white)',
                borderColor: 'var(--method-black)',
                cursor: 'pointer',
              }
            : unavailable
              ? { background: 'var(--method-white)', color: 'var(--method-ink)', opacity: 0.3, cursor: 'default' }
              : {
                  background: hovered ? 'var(--method)' : 'var(--method-white)',
                  color: hovered ? 'var(--method-white)' : 'var(--method-ink)',

                  boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                }
        }
      >
        {icon}
        {label}
      </button>
      {unavailable && tooltipPos && createPortal(
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
          Keine Methoden mit diesem Filter
        </span>,
        document.body
      )}
    </>
  )
}

export default function MethodFilters({ filters, onChange, onClearKey, availableOptions, allOptions, filterIcons, filterLucideIcons, allFilterItems, allCategoryItems, activeFilterKeys, parentOpen }: Props) {
  const locale = useLocale()
  const [openKeys, setOpenKeys] = useState<Set<FilterKey>>(new Set())
  const [hoveredKey, setHoveredKey] = useState<FilterKey | null>(null)

  useEffect(() => {
    if (!parentOpen) setOpenKeys(new Set())
  }, [parentOpen])

  function toggleAccordion(key: FilterKey) {
    setOpenKeys(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function toggleOption(key: FilterKey, value: string) {
    const current = filters[key]
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
    onChange({ ...filters, [key]: next })
  }

  const activeConfigs = FILTER_CONFIGS.filter(({ key }) => !activeFilterKeys || activeFilterKeys.has(key))

  return (
    <div className="flex flex-col">
      {activeConfigs.map(({ key, de, en }) => {
        const label = locale === 'de' ? de : en
        const options = allOptions[key]
        const isOpen = openKeys.has(key)
        const hasActive = filters[key].length > 0
        const activeValues = filters[key]
        const items = allFilterItems?.[key] ?? []
        const categories = allCategoryItems?.[key]
        const itemByName = new Map(items.map((it) => [getLocalizedName(it, locale), it] as const))

        if (!options || options.length === 0) return null

        return (
          <div
            key={key}
            style={isOpen ? { background: 'var(--method-light)' } : undefined}
            className="transition-colors"
          >
            {/* Sub-accordion header */}
            <button
              type="button"
              onClick={() => toggleAccordion(key)}
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
              className="w-full flex items-center justify-between px-5 py-3 text-left transition-colors cursor-pointer"
              style={
                isOpen
                  ? { color: 'var(--method-ink-accent)' }
                  : hoveredKey === key
                    ? { background: 'var(--method-light)', color: 'var(--method-ink)' }
                    : { color: 'var(--method-ink)' }
              }
            >
              <span className="flex items-center gap-2 text-text" style={{ color: 'var(--method-ink)' }}>
                <FilterIcon uploadUrl={filterIcons?.[key]} lucideName={filterLucideIcons?.[key]} className="w-[1em] h-[1em] object-contain" />
                <span className="font-medium">{label}</span>
                {hasActive && (
                  <ClearDot tooltip={`${label} zurücksetzen`} onClear={(e) => { e.stopPropagation(); onClearKey?.(key) }} />
                )}
              </span>
              <ChevronDown
                className={`w-[1em] h-[1em] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                style={{ color: 'var(--method-ink)', opacity: 0.5 }}
              />
            </button>

            {/* Sub-accordion body */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.25s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div style={{ overflow: 'hidden' }}>
                <div className="px-5 pb-4 pt-2">
                  {categories && categories.length > 0 ? (
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                      {categories.map((cat) => {
                        const catLabel = cat.name
                        const catItems = items.filter((item) => getCategoryId(item.category) === cat.id)
                        if (catItems.length === 0) return null
                        return (
                          <div key={cat.id} className="flex flex-col gap-1.5">
                            <span className="text-small opacity-50" style={{ color: 'var(--method-ink)' }}>{catLabel}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {catItems.map((item) => {
                                const name = getLocalizedName(item, locale)
                                if (!name) return null
                                return (
                                  <Chip
                                    key={item.id}
                                    label={name}
                                    icon={getItemIcon(item)}
                                    isActive={activeValues.includes(name)}
                                    isAvailable={availableOptions[key].includes(name)}
                                    onClick={() => toggleOption(key, name)}
                                  />
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {options.map((opt) => {
                        const item = itemByName.get(opt)
                        return (
                          <Chip
                            key={opt}
                            label={opt}
                            icon={item ? getItemIcon(item) : undefined}
                            isActive={activeValues.includes(opt)}
                            isAvailable={availableOptions[key].includes(opt)}
                            onClick={() => toggleOption(key, opt)}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
