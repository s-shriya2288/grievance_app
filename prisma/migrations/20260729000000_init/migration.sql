-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Suspended', 'Pending');

-- CreateEnum
CREATE TYPE "GrievancePriority" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('Open', 'InProgress', 'Resolved', 'Closed');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('TicketSubmitted', 'Assigned', 'StatusChanged', 'ReminderSent', 'Resolved', 'Reopened', 'Closed');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('Sent', 'Failed', 'Skipped');

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievance_categories" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "grievance_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievance_subcategories" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "subcategory_name" TEXT NOT NULL,

    CONSTRAINT "grievance_subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "password_hash" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "plant" TEXT NOT NULL DEFAULT 'Rajgangpur Unit',
    "profile_photo" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT true,
    "account_status" "AccountStatus" NOT NULL DEFAULT 'Active',
    "reset_otp_hash" TEXT,
    "reset_otp_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievances" (
    "id" TEXT NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "subcategory_id" TEXT NOT NULL,
    "assigned_admin" TEXT,
    "subject" TEXT NOT NULL,
    "date_of_incident" TIMESTAMP(3),
    "persons_involved" TEXT,
    "is_confidential" BOOLEAN NOT NULL DEFAULT false,
    "preferred_resolution" TEXT,
    "ai_priority_reasoning" TEXT,
    "priority" "GrievancePriority" NOT NULL DEFAULT 'Medium',
    "description" TEXT NOT NULL,
    "attachment" TEXT,
    "status" "GrievanceStatus" NOT NULL DEFAULT 'Open',
    "resolution" TEXT,
    "reopen_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "grievances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievance_comments" (
    "id" TEXT NOT NULL,
    "grievance_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grievance_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "satisfaction" (
    "id" TEXT NOT NULL,
    "grievance_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "satisfaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" "EmailStatus" NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "ip_address" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_department_name_key" ON "departments"("department_name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_name_key" ON "roles"("role_name");

-- CreateIndex
CREATE INDEX "grievance_categories_department_id_idx" ON "grievance_categories"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "grievance_categories_department_id_category_name_key" ON "grievance_categories"("department_id", "category_name");

-- CreateIndex
CREATE INDEX "grievance_subcategories_category_id_idx" ON "grievance_subcategories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "grievance_subcategories_category_id_subcategory_name_key" ON "grievance_subcategories"("category_id", "subcategory_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_department_id_idx" ON "users"("department_id");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "grievances_ticket_number_key" ON "grievances"("ticket_number");

-- CreateIndex
CREATE INDEX "grievances_employee_id_idx" ON "grievances"("employee_id");

-- CreateIndex
CREATE INDEX "grievances_department_id_idx" ON "grievances"("department_id");

-- CreateIndex
CREATE INDEX "grievances_status_idx" ON "grievances"("status");

-- CreateIndex
CREATE INDEX "grievances_created_at_idx" ON "grievances"("created_at");

-- CreateIndex
CREATE INDEX "grievance_comments_grievance_id_idx" ON "grievance_comments"("grievance_id");

-- CreateIndex
CREATE UNIQUE INDEX "satisfaction_grievance_id_key" ON "satisfaction"("grievance_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- AddForeignKey
ALTER TABLE "grievance_categories" ADD CONSTRAINT "grievance_categories_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance_subcategories" ADD CONSTRAINT "grievance_subcategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "grievance_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_assigned_admin_fkey" FOREIGN KEY ("assigned_admin") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "grievance_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "grievance_subcategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance_comments" ADD CONSTRAINT "grievance_comments_grievance_id_fkey" FOREIGN KEY ("grievance_id") REFERENCES "grievances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievance_comments" ADD CONSTRAINT "grievance_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "satisfaction" ADD CONSTRAINT "satisfaction_grievance_id_fkey" FOREIGN KEY ("grievance_id") REFERENCES "grievances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

