/*
  Warnings:

  - You are about to drop the column `lastNotification` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `price_id` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `plan_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_price_id_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "payment_mode" DROP NOT NULL,
ALTER COLUMN "company_paypal_email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "lastNotification",
DROP COLUMN "price_id",
ADD COLUMN     "lastNotificationDate" TEXT,
ADD COLUMN     "plan_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Price_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
