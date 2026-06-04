'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

export function KontaktForm() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white rounded-xl border p-7 flex flex-col gap-3 hover:shadow-md transition-all">
        <p className="text-display font-black tracking-tight" style={{ color: 'var(--method)' }}>
          Danke für deine Nachricht<span style={{ color: 'var(--method)' }}>.</span>
        </p>
        <p className="text-text" style={{ color: 'var(--method-ink)' }}>
          Wir melden uns so schnell wie möglich bei dir.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-7 flex flex-col gap-4 hover:shadow-md transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-small uppercase tracking-widest font-black" style={{ color: 'var(--method-ink)' }}>
            Name
          </label>
          <input
            type="text"
            placeholder="Dein Name"
            required
            className="rounded-lg border px-3 py-2 text-text outline-none focus:ring-2 transition-all"
            style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-small uppercase tracking-widest font-black" style={{ color: 'var(--method-ink)' }}>
            E-Mail
          </label>
          <input
            type="email"
            placeholder="deine@email.de"
            required
            className="rounded-lg border px-3 py-2 text-text outline-none focus:ring-2 transition-all"
            style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-small uppercase tracking-widest font-black" style={{ color: 'var(--method-ink)' }}>
          Betreff
        </label>
        <input
          type="text"
          placeholder="Worum geht es?"
          required
          className="rounded-lg border px-3 py-2 text-text outline-none focus:ring-2 transition-all"
          style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-small uppercase tracking-widest font-black" style={{ color: 'var(--method-ink)' }}>
          Nachricht
        </label>
        <textarea
          rows={5}
          placeholder="Deine Nachricht …"
          required
          className="rounded-lg border px-3 py-2 text-text outline-none focus:ring-2 transition-all resize-none"
          style={{ color: 'var(--method-ink-accent)', '--tw-ring-color': 'var(--method)' } as React.CSSProperties}
        />
      </div>

      <div className="flex">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-cta font-black transition-all"
          style={{ background: 'var(--method)', color: 'white' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--method-dark)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--method)')}
        >
          <Send className="w-[1em] h-[1em] shrink-0" />
          Absenden
        </button>
      </div>
    </form>
  )
}
