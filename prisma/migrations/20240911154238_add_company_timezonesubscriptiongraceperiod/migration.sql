/*
  Warnings:

  - The `last_notification_date` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'GRACE_PERIOD';

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "last_notification_date",
ADD COLUMN     "last_notification_date" TIMESTAMP(3);
