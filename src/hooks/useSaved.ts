'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  type SavedItem,
  addToSaved,
  getSaved,
  isInSaved,
  removeFromSaved,
} from '@/lib/saved'

export function useSaved() {
  const [saved, setSaved] = useState<SavedItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSaved(getSaved())

    function sync() {
      setSaved(getSaved())
    }
    window.addEventListener('uk-saved-change', sync)
    return () => window.removeEventListener('uk-saved-change', sync)
  }, [])

  const add = useCallback((item: SavedItem) => {
    addToSaved(item)
    setSaved(getSaved())
  }, [])

  const remove = useCallback((id: string) => {
    removeFromSaved(id)
    setSaved(getSaved())
  }, [])

  const inSaved = useCallback(
    (id: string) => (mounted ? isInSaved(id) : false),
    [mounted],
  )

  return { saved, add, remove, inSaved, mounted }
}
