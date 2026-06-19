'use client'

import { useEffect } from 'react'

/**
 * Collapses the "Filter: …" sidebar groups on first visit.
 *
 * Payload renders nav groups expanded until a collapse preference exists, so the
 * many filter groups fill the sidebar on a user's first load. This clicks each
 * open filter group's toggle once — which also persists Payload's own collapse
 * preference, so later server renders come back collapsed with no flash.
 *
 * A per-browser flag means we only auto-collapse once: if the user re-expands a
 * group afterwards, their choice sticks.
 */
export function CollapseFilterGroups() {
  useEffect(() => {
    const FLAG = 'uk-filter-nav-collapsed'
    if (window.localStorage.getItem(FLAG)) return

    const collapse = () => {
      const groups = document.querySelectorAll<HTMLElement>("[id^='nav-group-Filter']")
      if (groups.length === 0) return false // nav not mounted yet

      groups.forEach((group) => {
        if (group.classList.contains('nav-group--collapsed')) return // already closed
        group.querySelector<HTMLButtonElement>('button.nav-group__toggle')?.click()
      })
      window.localStorage.setItem(FLAG, '1')
      return true
    }

    if (collapse()) return

    // Nav may mount after us — retry briefly, then give up.
    const interval = window.setInterval(() => {
      if (collapse()) window.clearInterval(interval)
    }, 100)
    const stop = window.setTimeout(() => window.clearInterval(interval), 3000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(stop)
    }
  }, [])

  return null
}
