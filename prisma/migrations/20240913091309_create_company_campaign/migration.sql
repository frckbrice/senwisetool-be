/*
  Warnings:

  - You are about to drop the column `companyId` on the `Campaign` table. All the data in the column will be lost.
  - The `grace_period_end` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_companyId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "companyId";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "grace_period_end",
ADD COLUMN     "grace_period_end" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "Company_Campaign" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_Campaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Company_Campaign" ADD CONSTRAINT "Company_Campaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company_Campaign" ADD CONSTRAINT "Company_Campaign_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
