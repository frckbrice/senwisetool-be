/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `state` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "state" TEXT NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "logo" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_key" ON "Campaign"("name");
