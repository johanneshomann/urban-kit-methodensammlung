import type { Access } from 'payload'

/**
 * Access control for admin users and API-key clients.
 *
 * Payload's default access is `Boolean(user)` — any authenticated entity
 * (admin user OR API client) can do anything. To make API keys READ-ONLY we
 * restrict writes to logged-in users (the `users` collection), while leaving
 * `read` at its default so authenticated clients can still GET content.
 *
 * There are two admin roles (see the `role` field on the `users` collection):
 *   - `admin`  — full access to everything.
 *   - `editor` — may only work on content: methods, the filter collections and
 *     their settings, plus media/icons. No access to users, API clients or the
 *     legal platform texts (imprint, privacy, contact).
 *
 * The public website is unaffected: it reads via the local API, which bypasses
 * access control.
 */

type UserLike = { collection?: string; role?: string } | null | undefined

/** True for any logged-in user from the `users` collection (not an API client). */
const isAdminUser = (user: UserLike) => user?.collection === 'users'

/** Only logged-in users with the `admin` role pass. */
export const adminOnly: Access = ({ req }) => {
  const user = req?.user as UserLike
  return isAdminUser(user) && user?.role === 'admin'
}

/** Logged-in users with the `admin` or `editor` role pass. */
export const adminOrEditor: Access = ({ req }) => {
  const user = req?.user as UserLike
  return isAdminUser(user) && (user?.role === 'admin' || user?.role === 'editor')
}

/** Content & filter writes: admins and editors; `read` left at Payload's default. */
export const lockWritesToEditors = {
  create: adminOrEditor,
  update: adminOrEditor,
  delete: adminOrEditor,
}

/** Writes restricted to admins; `read` left at Payload's default (authenticated). */
export const lockWritesToAdmins = {
  create: adminOnly,
  update: adminOnly,
  delete: adminOnly,
}

/** Globals editable by admins and editors (filter settings); `read` at default. */
export const lockGlobalWritesToEditors = {
  update: adminOrEditor,
}

/** Globals: `update` restricted to admins; `read` left at default. */
export const lockGlobalWritesToAdmins = {
  update: adminOnly,
}

/** Fully admin-only — read + writes (e.g. Users, API Clients). */
export const adminOnlyCollection = {
  read: adminOnly,
  create: adminOnly,
  update: adminOnly,
  delete: adminOnly,
}
