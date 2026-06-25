import type { Access, FieldAccess } from 'payload'

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

/**
 * Admins may read/manage any user; everyone else (e.g. editors) is scoped to
 * their own record only — so the `/admin/account` page works for them without
 * exposing other users.
 */
export const selfOrAdmin: Access = ({ req }) => {
  const user = req?.user as UserLike
  if (!isAdminUser(user)) return false
  if (user?.role === 'admin') return true
  const id = (user as { id?: string | number } | null | undefined)?.id
  return id != null ? { id: { equals: id } } : false
}

/** Field-level: only admins (returns a boolean, as required for field access). */
export const adminFieldAccess: FieldAccess = ({ req }) => {
  const user = req?.user as UserLike
  return isAdminUser(user) && user?.role === 'admin'
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

/** Fully admin-only — read + writes (e.g. API Clients). */
export const adminOnlyCollection = {
  read: adminOnly,
  create: adminOnly,
  update: adminOnly,
  delete: adminOnly,
}

/**
 * Users collection: admins manage everyone; a non-admin (editor) may read and
 * update only their own record (needed for the account page / password change).
 * Creating and deleting users stays admin-only, and the `role` field is locked
 * to admins via field access so an editor cannot escalate their own role.
 */
export const usersCollectionAccess = {
  read: selfOrAdmin,
  create: adminOnly,
  update: selfOrAdmin,
  delete: adminOnly,
}
