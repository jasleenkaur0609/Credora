-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mustResetPassword" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
