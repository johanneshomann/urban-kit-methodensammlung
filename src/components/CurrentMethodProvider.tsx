'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { SavedItem } from '@/lib/saved'

type Ctx = {
  current: SavedItem | null
  setCurrent: (item: SavedItem | null) => void
}

const CurrentMethodContext = createContext<Ctx>({ current: null, setCurrent: () => {} })

export function CurrentMethodProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<SavedItem | null>(null)
  return (
    <CurrentMethodContext.Provider value={{ current, setCurrent }}>
      {children}
    </CurrentMethodContext.Provider>
  )
}

export function useCurrentMethod() {
  return useContext(CurrentMethodContext)
}

/**
 * Rendered on a method page to register the currently viewed method with the
 * global SavedWidget. Clears itself on unmount (i.e. when navigating away).
 */
export function RegisterCurrentMethod({ item }: { item: SavedItem }) {
  const { setCurrent } = useCurrentMethod()
  const key = JSON.stringify(item)
  useEffect(() => {
    setCurrent(item)
    return () => setCurrent(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setCurrent])
  return null
}
