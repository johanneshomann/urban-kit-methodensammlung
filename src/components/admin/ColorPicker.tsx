// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useField, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

/**
 * Color field for Platform Settings. Renders a native color swatch next to a
 * hex text input, kept in sync. Hex-only by design (the exposed brand/text
 * colors are all hex). Empty value falls back to the per-field default defined
 * in src/lib/theme.ts when injected into the public site.
 */
export function ColorPicker(props: TextFieldClientProps) {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })

  const label = typeof field?.label === 'string' ? field.label : undefined
  // The admin.description is localized by Payload before reaching the client, so
  // it arrives as a plain string here. Render it manually since a custom Field
  // component replaces Payload's default field (which would otherwise show it).
  const description = typeof field?.admin?.description === 'string' ? field.admin.description : undefined
  // Native <input type=color> requires a valid #rrggbb; fall back to a neutral
  // swatch when the field is empty or holds a non-hex value.
  const isHex = typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)
  const swatch = isHex ? value : '#ffffff'

  return (
    <div className="field-type text" style={{ marginBottom: '1.5rem' }}>
      <FieldLabel label={label} path={path} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="color"
          value={swatch}
          onChange={(e) => setValue(e.target.value)}
          aria-label={label ? `${label} color picker` : 'Color picker'}
          style={{
            width: 40,
            height: 40,
            padding: 0,
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            background: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={value ?? ''}
          placeholder="#000000"
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1,
            height: 40,
            padding: '0 12px',
            fontFamily: 'monospace',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 6,
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-elevation-800)',
          }}
        />
      </div>
      {description && (
        <div
          className="field-description"
          style={{ marginTop: 6, fontSize: 12, lineHeight: 1.4, color: 'var(--theme-elevation-450)' }}
        >
          {description}
        </div>
      )}
    </div>
  )
}
