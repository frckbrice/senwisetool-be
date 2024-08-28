/*
  Warnings:

  - You are about to drop the column `auto_renewal` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `billing_cycle` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Subscription` table. All the data in the column will be lost.
  - The `status` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `company_paypal_email` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'APPROVAL_PENDING';

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "company_paypal_email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "auto_renewal",
DROP COLUMN "billing_cycle",
DROP COLUMN "description",
DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'INACTIVE';
