-- AlterTable
ALTER TABLE "grievances" ADD COLUMN "redirect_deadline" TIMESTAMP(3);
ALTER TABLE "grievances" ADD COLUMN "redirect_reminder_sent_at" TIMESTAMP(3);
