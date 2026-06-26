/**
 * POST /api/kontakt — contact form handler. Validates the payload, then sends mail
 * via Payload's configured Nodemailer transport. Recipient, from-name and the
 * enable toggle come from the PlatformSettings global; SMTP credentials come from
 * env (see AGENTS.md "Email config is split").
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: {
    name?: string
    email?: string
    betreff?: string
    nachricht?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim()
  const betreff = body.betreff?.trim()
  const nachricht = body.nachricht?.trim()

  if (!name || !email || !betreff || !nachricht) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'platform-settings' as any })

  if (!settings.mailEnabled) {
    return NextResponse.json({ error: 'disabled' }, { status: 503 })
  }

  const recipient = (settings.mailRecipient as string | undefined) || (settings.kontaktEmail as string | undefined)
  if (!recipient) {
    return NextResponse.json({ error: 'no_recipient' }, { status: 500 })
  }

  const prefix = (settings.mailSubjectPrefix as string | undefined)?.trim()
  const subject = prefix ? `${prefix} ${betreff}` : betreff

  // Override the sender display name only when both a name and a configured
  // from-address are available; otherwise fall back to the adapter default.
  const fromName = (settings.mailFromName as string | undefined)?.trim()
  const fromAddress = process.env.SMTP_FROM_ADDRESS
  const from = fromName && fromAddress ? `${fromName} <${fromAddress}>` : undefined

  const text = [`Name: ${name}`, `E-Mail: ${email}`, '', nachricht].join('\n')

  try {
    await payload.sendEmail({
      ...(from ? { from } : {}),
      to: recipient,
      replyTo: `${name} <${email}>`,
      subject,
      text,
    })
  } catch (err) {
    payload.logger.error({ err }, 'Contact form email failed to send')
    return NextResponse.json({ error: 'send_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
