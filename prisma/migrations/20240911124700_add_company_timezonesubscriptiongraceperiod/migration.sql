/*
  Warnings:

  - You are about to drop the column `lastNotificationDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `grace_period_end` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "lastNotificationDate",
DROP COLUMN "timeZone",
ADD COLUMN     "grace_period_end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "last_notification_date" TEXT;
