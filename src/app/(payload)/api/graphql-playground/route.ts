// SPDX-FileCopyrightText: 2026 Johannes Homann
//
// SPDX-License-Identifier: EUPL-1.2

// Interactive GraphQL IDE — Payload disables it in production by default
// (graphQL.disablePlaygroundInProduction), so mounting it is dev-only in effect.
import config from '@payload-config'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
