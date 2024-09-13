-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "lastNotification" TEXT,
ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'UTC';
