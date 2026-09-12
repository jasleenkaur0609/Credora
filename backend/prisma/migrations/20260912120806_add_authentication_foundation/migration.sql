/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'LOGIN_VERIFICATION');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditEventType" ADD VALUE 'USER_UPDATED';
ALTER TYPE "AuditEventType" ADD VALUE 'ACCOUNT_SUSPENDED';
ALTER TYPE "AuditEventType" ADD VALUE 'ACCOUNT_REACTIVATED';
ALTER TYPE "AuditEventType" ADD VALUE 'SESSION_REFRESHED';
ALTER TYPE "AuditEventType" ADD VALUE 'LOGOUT_ALL_SESSIONS';
ALTER TYPE "AuditEventType" ADD VALUE 'PERMISSION_ASSIGNED';
ALTER TYPE "AuditEventType" ADD VALUE 'PERMISSION_REMOVED';
ALTER TYPE "AuditEventType" ADD VALUE 'OTP_GENERATED';
ALTER TYPE "AuditEventType" ADD VALUE 'OTP_VERIFIED';
ALTER TYPE "AuditEventType" ADD VALUE 'OTP_FAILED';
ALTER TYPE "AuditEventType" ADD VALUE 'OTP_EXPIRED';
ALTER TYPE "AuditEventType" ADD VALUE 'SECURITY_POLICY_CHANGED';

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "code" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "last_used_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "disabled_at" TIMESTAMP(3),
ADD COLUMN     "email_verified_at" TIMESTAMP(3),
ADD COLUMN     "suspended_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "otp_records" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "purpose" "OtpPurpose" NOT NULL,
    "code_hash" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_history" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_invitations" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "role_id" UUID NOT NULL,
    "invited_by" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_records_user_id_purpose_idx" ON "otp_records"("user_id", "purpose");

-- CreateIndex
CREATE INDEX "otp_records_expires_at_idx" ON "otp_records"("expires_at");

-- CreateIndex
CREATE INDEX "otp_records_purpose_idx" ON "otp_records"("purpose");

-- CreateIndex
CREATE INDEX "password_history_user_id_idx" ON "password_history"("user_id");

-- CreateIndex
CREATE INDEX "password_history_created_at_idx" ON "password_history"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "password_reset_tokens_status_idx" ON "password_reset_tokens"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_invitations_token_hash_key" ON "user_invitations"("token_hash");

-- CreateIndex
CREATE INDEX "user_invitations_email_idx" ON "user_invitations"("email");

-- CreateIndex
CREATE INDEX "user_invitations_role_id_idx" ON "user_invitations"("role_id");

-- CreateIndex
CREATE INDEX "user_invitations_invited_by_idx" ON "user_invitations"("invited_by");

-- CreateIndex
CREATE INDEX "user_invitations_status_idx" ON "user_invitations"("status");

-- CreateIndex
CREATE INDEX "user_invitations_expires_at_idx" ON "user_invitations"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_severity_idx" ON "audit_logs"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

-- CreateIndex
CREATE INDEX "roles_type_idx" ON "roles"("type");

-- CreateIndex
CREATE INDEX "sessions_last_used_at_idx" ON "sessions"("last_used_at");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- AddForeignKey
ALTER TABLE "otp_records" ADD CONSTRAINT "otp_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_history" ADD CONSTRAINT "password_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
