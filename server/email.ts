import { prisma } from './db.js'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'no-reply@dalmia-rajgangpur-grievance.app'

export interface SendEmailInput {
  to: string
  subject: string
  html: string
}

export interface SendEmailResult {
  sent: boolean
}

/**
 * Sends an email via Resend when RESEND_API_KEY is configured; otherwise
 * logs the attempt (status "Skipped") so the app stays usable in dev/demo
 * environments without a real email provider.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    console.warn(`RESEND_API_KEY not set — skipping email to ${input.to}: "${input.subject}"`)
    await prisma.emailLog.create({
      data: { recipient: input.to, subject: input.subject, status: 'Skipped' },
    })
    return { sent: false }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: input.to, subject: input.subject, html: input.html }),
    })
    await prisma.emailLog.create({
      data: { recipient: input.to, subject: input.subject, status: res.ok ? 'Sent' : 'Failed' },
    })
    return { sent: res.ok }
  } catch (error) {
    console.error('Failed to send email:', error)
    await prisma.emailLog.create({
      data: { recipient: input.to, subject: input.subject, status: 'Failed' },
    })
    return { sent: false }
  }
}
