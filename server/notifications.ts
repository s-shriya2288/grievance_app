import { prisma } from './db.js'
import { sendEmail } from './email.js'
import { grievanceNotificationTemplate } from './email/templates.js'
import { AppError } from './errors.js'
import type { NotificationType } from '../generated/prisma/client.js'

export async function notifyUser(
  userId: string,
  input: { title: string; message: string; type: NotificationType },
): Promise<void> {
  await prisma.notification.create({
    data: { userId, title: input.title, message: input.message, type: input.type },
  })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user) {
    await sendEmail({
      to: user.email,
      subject: input.title,
      html: grievanceNotificationTemplate(input.title, input.message),
    })
  }
}

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export async function markNotificationRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
  if (!notification || notification.userId !== userId) {
    throw new AppError('Notification not found.', 404)
  }
  return prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } })
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } })
}
