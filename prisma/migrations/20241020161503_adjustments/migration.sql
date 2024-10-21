/*
  Warnings:

  - You are about to drop the column `market_number` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the `Campaign_stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Market_audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Price_plan_requirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requirement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `company_id` to the `Assignee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `market_code` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Campaign_stock" DROP CONSTRAINT "Campaign_stock_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "Market_audit" DROP CONSTRAINT "Market_audit_market_id_fkey";

-- DropForeignKey
ALTER TABLE "Market_audit" DROP CONSTRAINT "Market_audit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Price_plan_requirement" DROP CONSTRAINT "Price_plan_requirement_price_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "Price_plan_requirement" DROP CONSTRAINT "Price_plan_requirement_req_id_fkey";

-- AlterTable
ALTER TABLE "Assignee" ADD COLUMN     "company_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Market" ALTER COLUMN "bordereau_vente_url" DROP NOT NULL,
ALTER COLUMN "bon_entree_magazin_url" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "market_number",
ADD COLUMN     "market_code" TEXT NOT NULL;

-- DropTable
DROP TABLE "Campaign_stock";

-- DropTable
DROP TABLE "Market_audit";

-- DropTable
DROP TABLE "Price_plan_requirement";

-- DropTable
DROP TABLE "Requirement";

-- AddForeignKey
ALTER TABLE "Assignee" ADD CONSTRAINT "Assignee_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
