'use client'

import { useEffect } from 'react'

/**
 * On the assistant page, fade out the site chrome (header + floating buttons)
 * once the user has scrolled all the way to the bottom — so the chat fills the
 * whole view. Toggles `html.chat-immersive`; CSS in globals.css does the fading.
 * Renders nothing.
 */
export default function AssistantImmersive() {
  useEffect(() => {
    const root = document.documentElement
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      root.classList.toggle('chat-immersive', atBottom)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      root.classList.remove('chat-immersive')
    }
  }, [])

  return null
}
