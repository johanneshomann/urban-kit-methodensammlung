// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

import { createNavigation } from 'next-intl/navigation'
import { routing } from './i18n/routing'

export const { Link, redirect, useRouter, usePathname } = createNavigation(routing)
