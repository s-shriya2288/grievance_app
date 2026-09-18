const APP_URL = process.env.APP_URL || 'http://localhost:5173'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

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

export function verifyEmailTemplate(otp: string): string {
  return shell(
    'Verify Your Email',
    `<p>Use the code below to verify your email and activate your Dalmia Rajgangpur Grievance Portal account. It expires in 10 minutes.</p>
     <p style="font-size:28px; font-weight:700; letter-spacing:6px; color:#163e91;">${otp}</p>
     <p style="color:#64748b; font-size:12px;">If you didn't create this account, you can safely ignore this email.</p>`,
  )
}

export function grievanceNotificationTemplate(title: string, message: string): string {
  return shell(title, `<p>${escapeHtml(message)}</p>`)
}

export function departmentRedirectTemplate(input: {
  ticketNumber: string
  subject: string
  departmentName: string
  viewUrl: string
  note?: string | null
  deadline?: string | null
}): string {
  const subject = escapeHtml(input.subject)
  const departmentName = escapeHtml(input.departmentName)
  const noteHtml = input.note
    ? `<p style="background:#f1f5f9;border-radius:8px;padding:10px 14px;color:#334155;font-size:14px;">
         <strong>Note from the redirecting admin:</strong><br />${escapeHtml(input.note)}
       </p>`
    : ''
  const deadlineHtml = input.deadline
    ? `<p style="color:#b45309;font-size:14px;"><strong>Resolution deadline:</strong> ${escapeHtml(input.deadline)} — a reminder will go out to the department if it isn't resolved by then.</p>`
    : ''
  return shell(
    `Grievance Routed to ${departmentName}`,
    `<p>Grievance <strong>${input.ticketNumber}</strong> — "${subject}" — has been routed to your department for action.</p>
     ${noteHtml}
     ${deadlineHtml}
     <p><a href="${input.viewUrl}" style="color:#163e91;">View the grievance →</a></p>`,
  )
}

export function redirectDeadlineReminderTemplate(input: {
  ticketNumber: string
  subject: string
  departmentName: string
  deadline: string
  viewUrl: string
}): string {
  const subject = escapeHtml(input.subject)
  const departmentName = escapeHtml(input.departmentName)
  return shell(
    `Overdue: Grievance ${input.ticketNumber}`,
    `<p>Grievance <strong>${input.ticketNumber}</strong> — "${subject}" — was routed to the <strong>${departmentName}</strong>
        department with a resolution deadline of <strong>${escapeHtml(input.deadline)}</strong>, which has now passed
        without it being marked Resolved or Closed.</p>
     <p><a href="${input.viewUrl}" style="color:#163e91;">View the grievance →</a></p>`,
  )
}

export function welcomeEmailTemplate(input: { firstName: string; employeeId: string }): string {
  const name = escapeHtml(input.firstName)
  const employeeId = escapeHtml(input.employeeId)
  return shell(
    'Welcome to the Grievance Portal',
    `<p>Hi ${name},</p>
     <p>Your account has been created successfully. You can sign in any time using your Employee ID
        <strong>${employeeId}</strong> and the password you chose during registration.</p>
     <p><a href="${APP_URL}/login" style="color:#163e91;">Sign in to the portal →</a></p>

     <h3 style="color:#163e91; font-size:15px; margin:24px 0 8px;">How the portal works</h3>
     <ol style="padding-left:20px; margin:0; color:#334155; font-size:14px; line-height:1.7;">
       <li><strong>Submit a grievance</strong> — go to "Submit New Grievance," pick a category (it's
           automatically routed to the right department, like HR, IT, or Safety), describe what
           happened, and submit. Our system assigns a priority automatically — you don't need to.</li>
       <li><strong>Track status</strong> — your grievance moves through Open → In Progress → Resolved →
           Closed. You'll get a notification (and an email) every time the status changes.</li>
       <li><strong>Add comments</strong> — you can add follow-up comments to your ticket at any time,
           and see replies from the department handling it.</li>
       <li><strong>Rate the resolution</strong> — once marked Resolved, you'll be asked to rate how it
           was handled. This closes the ticket.</li>
       <li><strong>Reopen if needed</strong> — if the issue wasn't actually fixed, you can reopen a
           Resolved or Closed ticket directly from its detail page.</li>
       <li><strong>Notifications</strong> — the bell icon in the top bar shows all your updates in one
           place, in addition to email.</li>
       <li><strong>Your profile</strong> — from the profile page you can update your name, phone
           number, Employee ID, and password at any time.</li>
     </ol>

     <p style="color:#64748b; font-size:12px; margin-top:20px;">
       If you didn't create this account, please contact HR immediately.
     </p>`,
  )
}
