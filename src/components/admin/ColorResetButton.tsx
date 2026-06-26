// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

'use client'

import { useForm, useTranslation } from '@payloadcms/ui'
import { COLOR_DEFAULTS } from '@/lib/theme'

/**
 * Resets every color field in Platform Settings back to COLOR_DEFAULTS.
 * The change still needs to be saved — this only updates the form state.
 */
const RESETS: Record<string, string> = {
  colorMethodMain: COLOR_DEFAULTS.methodMain,
  colorMethodAccent: COLOR_DEFAULTS.methodAccent,
  colorMethodDark: COLOR_DEFAULTS.methodDark,
  colorMethodLight: COLOR_DEFAULTS.methodLight,
  colorMethodVeryLight: COLOR_DEFAULTS.methodVeryLight,
  colorInk: COLOR_DEFAULTS.ink,
  colorInkAccent: COLOR_DEFAULTS.inkAccent,
}

export function ColorResetButton() {
  const { dispatchFields, setModified } = useForm()
  const { i18n } = useTranslation()
  const de = i18n.language?.startsWith('de')

  const onReset = () => {
    for (const [path, value] of Object.entries(RESETS)) {
      dispatchFields({ type: 'UPDATE', path, value })
    }
    setModified(true)
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button type="button" className="btn btn--style-secondary btn--size-small" onClick={onReset}>
        {de ? 'Auf Standardfarben zurücksetzen' : 'Reset to default colors'}
      </button>
    </div>
  )
}
