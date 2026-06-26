// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { getPlatformIdentity } from '@/lib/platformIdentity'

/**
 * Admin logo (login screen + nav header). Reads the uploaded logo from
 * Platform Settings → Branding, falling back to the built-in default.
 */
export async function BrandLogo() {
  const { adminLogo } = await getPlatformIdentity()
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={adminLogo} alt="Logo" style={{ maxHeight: 60, maxWidth: 240, objectFit: 'contain' }} />
}
