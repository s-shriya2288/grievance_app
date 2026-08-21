import { prisma } from './db.js'

const BREVO_API_KEY = process.env.BREVO_API_KEY
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'no-reply@dalmia-rajgangpur-grievance.app'
const FROM_NAME = process.env.BREVO_FROM_NAME || 'Dalmia Rajgangpur Grievance Portal'

export interface SendEmailInput {
  to: string
  subject: string
  html: string
}

export interface SendEmailResult {
  sent: boolean
}

/**
 * Sends an email via Brevo when BREVO_API_KEY is configured; otherwise logs
 * the attempt (status "Skipped") so the app stays usable in dev/demo
 * environments without a real email provider.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!BREVO_API_KEY) {
    console.warn(`BREVO_API_KEY not set — skipping email to ${input.to}: "${input.subject}"`)
    await prisma.emailLog.create({
      data: { recipient: input.to, subject: input.subject, status: 'Skipped' },
    })
    return { sent: false }
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: input.to }],
        subject: input.subject,
        htmlContent: input.html,
      }),
    })
    await prisma.emailLog.create({
      data: { recipient: input.to, subject: input.subject, status: res.ok ? 'Sent' : 'Failed' },
    })
    if (!res.ok) {
      console.error('Brevo email send failed:', res.status, await res.text())
    }
    return { sent: res.ok }
  } catch (error) {
    console.error('Failed to send email:', error)
    await prisma.emailLog.create({
      data: { recipient: input.to, subject: input.subject, status: 'Failed' },
    })
    return { sent: false }
  }
}
