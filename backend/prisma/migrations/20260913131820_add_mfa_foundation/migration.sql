-- CreateEnum
CREATE TYPE "MfaMethod" AS ENUM ('TOTP');

-- CreateEnum
CREATE TYPE "MfaChallengePurpose" AS ENUM ('LOGIN', 'SETUP');

CREATE TYPE "MfaChallengeStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'EXPIRED', 'LOCKED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditEventType" ADD VALUE 'MFA_CHALLENGE_CREATED';
ALTER TYPE "AuditEventType" ADD VALUE 'MFA_SUCCESS';
ALTER TYPE "AuditEventType" ADD VALUE 'MFA_FAILED';
ALTER TYPE "AuditEventType" ADD VALUE 'MFA_LOCKED';
ALTER TYPE "AuditEventType" ADD VALUE 'MFA_ENABLED';
ALTER TYPE "AuditEventType" ADD VALUE 'MFA_DISABLED';

-- CreateTable
CREATE TABLE "mfa_configurations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "method" "MfaMethod" NOT NULL DEFAULT 'TOTP',
    "secret_encrypted" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mfa_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa_challenges" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "purpose" "MfaChallengePurpose" NOT NULL DEFAULT 'LOGIN',
    "status" "MfaChallengeStatus" NOT NULL DEFAULT 'ACTIVE',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mfa_configurations_user_id_key" ON "mfa_configurations"("user_id");

-- CreateIndex
CREATE INDEX "mfa_configurations_enabled_idx" ON "mfa_configurations"("enabled");

-- CreateIndex
CREATE INDEX "mfa_challenges_user_id_purpose_status_idx" ON "mfa_challenges"("user_id", "purpose", "status");

-- CreateIndex
CREATE INDEX "mfa_challenges_expires_at_idx" ON "mfa_challenges"("expires_at");

-- CreateIndex
CREATE INDEX "mfa_challenges_created_at_idx" ON "mfa_challenges"("created_at");

-- AddForeignKey
ALTER TABLE "mfa_configurations" ADD CONSTRAINT "mfa_configurations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa_challenges" ADD CONSTRAINT "mfa_challenges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

