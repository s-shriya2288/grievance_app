-- AlterTable
ALTER TABLE "users" ALTER COLUMN "is_verified" SET DEFAULT false;
ALTER TABLE "users" ADD COLUMN "verify_otp_hash" TEXT;
ALTER TABLE "users" ADD COLUMN "verify_otp_expires_at" TIMESTAMP(3);
