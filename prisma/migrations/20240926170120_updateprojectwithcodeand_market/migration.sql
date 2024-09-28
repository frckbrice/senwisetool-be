/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `head_office_email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_quantity` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('CONFIRMED', 'NOT_CONFIRMED');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "head_office_email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "code" TEXT,
ADD COLUMN     "product_quantity" INTEGER NOT NULL,
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'CLOSED';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project_audit" ADD COLUMN     "invitation_status" "InvitationStatus" DEFAULT 'NOT_CONFIRMED',
ADD COLUMN     "invited_by" TEXT,
ALTER COLUMN "action" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");
