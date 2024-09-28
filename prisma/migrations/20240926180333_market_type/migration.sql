/*
  Warnings:

  - You are about to drop the column `market_type` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Market_audit` table. All the data in the column will be lost.
  - Added the required column `campaign_id` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('COCOA', 'COFFEE', 'BANANA', 'WOOD', 'OTHER');

-- AlterTable
ALTER TABLE "Market" DROP COLUMN "market_type",
ADD COLUMN     "campaign_id" TEXT NOT NULL,
ADD COLUMN     "type_of_market" "MarketType" NOT NULL DEFAULT 'COCOA';

-- AlterTable
ALTER TABLE "Market_audit" DROP COLUMN "date";

-- CreateIndex
CREATE INDEX "Campaign_id_idx" ON "Campaign"("id");

-- CreateIndex
CREATE INDEX "Campaign_stock_campaign_id_idx" ON "Campaign_stock"("campaign_id");

-- CreateIndex
CREATE INDEX "Company_id_status_email_idx" ON "Company"("id", "status", "email");

-- CreateIndex
CREATE INDEX "Farm_farmer_id_location_idx" ON "Farm"("farmer_id", "location");

-- CreateIndex
CREATE INDEX "Farm_coordinates_farm_id_located_at_idx" ON "Farm_coordinates"("farm_id", "located_at");

-- CreateIndex
CREATE INDEX "Inspection_data_project_id_collected_by_idx" ON "Inspection_data"("project_id", "collected_by");

-- CreateIndex
CREATE INDEX "Market_company_id_start_date_end_date_idx" ON "Market"("company_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "Price_plan_product_name_id_plan_name_status_idx" ON "Price_plan"("product_name", "id", "plan_name", "status");

-- CreateIndex
CREATE INDEX "Project_id_company_id_start_date_end_date_sector_activity_t_idx" ON "Project"("id", "company_id", "start_date", "end_date", "sector_activity", "type");

-- CreateIndex
CREATE INDEX "Subscription_company_id_plan_id_status_id_idx" ON "Subscription"("company_id", "plan_id", "status", "id");

-- CreateIndex
CREATE INDEX "Training_company_id_start_date_end_date_title_id_idx" ON "Training"("company_id", "start_date", "end_date", "title", "id");

-- CreateIndex
CREATE INDEX "User_id_email_phone_number_idx" ON "User"("id", "email", "phone_number");

-- CreateIndex
CREATE INDEX "training_session_email_id_training_id_first_name_last_name_idx" ON "training_session"("email", "id", "training_id", "first_name", "last_name");
