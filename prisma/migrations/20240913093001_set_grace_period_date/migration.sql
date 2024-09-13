/*
  Warnings:

  - Added the required column `grace_period_end` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "grace_period_end",
ADD COLUMN     "grace_period_end" TIMESTAMP(3) NOT NULL;
