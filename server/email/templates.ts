const APP_URL = process.env.APP_URL || 'http://localhost:5173'

function shell(title: string, bodyHtml: string): string {
  return `
  <div style="font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1f2330;">
    <img src="${APP_URL}/brand/dalmia-icon.png" alt="Dalmia Bharat" width="44" height="44" style="display:block;margin-bottom:16px;" />
    <h2 style="color:#163e91; margin: 0 0 12px;">${title}</h2>
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
    <p style="color:#94a3b8; font-size:11px; margin:0;">
      © Dalmia Cement (Bharat) Limited – Rajgangpur Plant<br />
      Employee Grievance Management Portal · Internal Use Only
    </p>
  </div>`
}

export function otpEmailTemplate(otp: string): string {
  return shell(
    'Password Reset Code',
    `<p>Use the code below to reset your Dalmia Rajgangpur Grievance Portal password. It expires in 10 minutes.</p>
     <p style="font-size:28px; font-weight:700; letter-spacing:6px; color:#163e91;">${otp}</p>
     <p style="color:#64748b; font-size:12px;">If you didn't request this, you can safely ignore this email.</p>`,
  )
}

export function grievanceNotificationTemplate(title: string, message: string): string {
  return shell(title, `<p>${message}</p>`)
}
