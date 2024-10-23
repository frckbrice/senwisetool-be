/*
  Warnings:

  - The values [FARMER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [EXTERNAL_INSPECTION] on the enum `TypeProject` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `companyId` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Collector_agent` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Collector_agent` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `council` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `collected_by` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `estimate_area` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `located_at` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `mapping_date` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `collected_by` on the `Inspection_data` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Inspection_data` table. All the data in the column will be lost.
  - You are about to drop the column `project_data_url` on the `Inspection_data` table. All the data in the column will be lost.
  - You are about to drop the column `market_number` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the column `market_type` on the `Market` table. All the data in the column will be lost.
  - You are about to drop the column `archived` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `draft` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `company_signature` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `farmer_picture_urls` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `farmer_signature` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `humidity_level_of_product` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `net_weight_for_sale` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `net_weight_in_kg` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_in_bags` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `receipt_number` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `refraction_humidity_or_quality` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `statutory_prerequisite` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `unit_amount_per_kg` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `price_id` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `training_attendance_sheet_url` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `training_picture_url` on the `Training` table. All the data in the column will be lost.
  - The `modules` column on the `Training` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Campaign_stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company_training_audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Market_audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Price_plan_requiement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Requirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Training_participant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Market` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Training` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `Collector_agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_code` to the `Collector_agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `head_office_email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimate_area` to the `Farm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantation_creation_date` to the `Farm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collector_name` to the `Farm_coordinates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accompanying_url` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaign_id` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_of_theday` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_quantity` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transmission_url` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campaign_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deployed_at` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `project_structure` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `agentName` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentSignature` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmerSignature` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpsLocation` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `market_number` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netWeight` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerKg` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refraction` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_id` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `archived_at` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted_at` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deployed_at` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('COCOA', 'COFFEE', 'BANANA', 'WOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('CONFIRMED', 'NOT_CONFIRMED');

-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'DEPLOYED';

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PDG', 'EMPLOYEE', 'AGENT', 'ADG', 'AUDITOR', 'SALES', 'IT_SUPPORT');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PDG';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubscriptionStatus" ADD VALUE 'EXPIRED';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'GRACE_PERIOD';

-- AlterEnum
BEGIN;
CREATE TYPE "TypeProject_new" AS ENUM ('INITIAL_INSPECTION', 'INTERNAL_INSPECTION', 'AUTO_EVALUATION', 'MAPPING', 'TRAINING');
ALTER TABLE "Project" ALTER COLUMN "type" TYPE "TypeProject_new" USING ("type"::text::"TypeProject_new");
ALTER TABLE "Project_audit" ALTER COLUMN "type_of_project" TYPE "TypeProject_new" USING ("type_of_project"::text::"TypeProject_new");
ALTER TYPE "TypeProject" RENAME TO "TypeProject_old";
ALTER TYPE "TypeProject_new" RENAME TO "TypeProject";
DROP TYPE "TypeProject_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Campaign_stock" DROP CONSTRAINT "Campaign_stock_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "Company_training_audit" DROP CONSTRAINT "Company_training_audit_training_id_fkey";

-- DropForeignKey
ALTER TABLE "Company_training_audit" DROP CONSTRAINT "Company_training_audit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Market_audit" DROP CONSTRAINT "Market_audit_market_id_fkey";

-- DropForeignKey
ALTER TABLE "Market_audit" DROP CONSTRAINT "Market_audit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Price_plan_requiement" DROP CONSTRAINT "Price_plan_requiement_price_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "Price_plan_requiement" DROP CONSTRAINT "Price_plan_requiement_req_id_fkey";

-- DropForeignKey
ALTER TABLE "Project_audit" DROP CONSTRAINT "Project_audit_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Project_audit" DROP CONSTRAINT "Project_audit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_price_id_fkey";

-- DropForeignKey
ALTER TABLE "Training_participant" DROP CONSTRAINT "Training_participant_training_id_fkey";

-- DropIndex
DROP INDEX "Company_logo_key";

-- DropIndex
DROP INDEX "Company_paypal_id_key";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "companyId",
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'CLOSED';

-- AlterTable
ALTER TABLE "Collector_agent" DROP COLUMN "code",
DROP COLUMN "companyId",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "project_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "head_office_email" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "status" "CompanyStatus",
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "logo" DROP NOT NULL,
ALTER COLUMN "payment_mode" DROP NOT NULL,
ALTER COLUMN "company_paypal_email" DROP NOT NULL,
ALTER COLUMN "paypal_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Farm" DROP COLUMN "council",
DROP COLUMN "creation_date",
DROP COLUMN "division",
ADD COLUMN     "estimate_area" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "plantation_creation_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "plantation_photos" TEXT[];

-- AlterTable
ALTER TABLE "Farm_coordinates" DROP COLUMN "collected_by",
DROP COLUMN "estimate_area",
DROP COLUMN "located_at",
DROP COLUMN "mapping_date",
ADD COLUMN     "collector_name" TEXT NOT NULL,
ADD COLUMN     "location" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Inspection_data" DROP COLUMN "collected_by",
DROP COLUMN "created_at",
DROP COLUMN "project_data_url";

-- AlterTable
ALTER TABLE "Market" DROP COLUMN "market_number",
DROP COLUMN "market_type",
ADD COLUMN     "accompanying_url" TEXT NOT NULL,
ADD COLUMN     "campaign_id" TEXT NOT NULL,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "price_of_theday" INTEGER NOT NULL,
ADD COLUMN     "product_quantity" INTEGER NOT NULL,
ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'CLOSED',
ADD COLUMN     "transmission_url" TEXT NOT NULL,
ADD COLUMN     "type_of_market" "MarketType" NOT NULL DEFAULT 'COCOA';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "archived",
DROP COLUMN "created_at",
DROP COLUMN "draft",
ADD COLUMN     "another_logo" TEXT,
ADD COLUMN     "campaign_id" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "deployed_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "project_structure" SET NOT NULL,
ALTER COLUMN "draft_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Project_audit" ADD COLUMN     "action" "ProjectStatus" DEFAULT 'DRAFT',
ADD COLUMN     "invitation_status" "InvitationStatus" DEFAULT 'NOT_CONFIRMED',
ADD COLUMN     "invited_by" TEXT;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "company_signature",
DROP COLUMN "farmer_picture_urls",
DROP COLUMN "farmer_signature",
DROP COLUMN "humidity_level_of_product",
DROP COLUMN "net_weight_for_sale",
DROP COLUMN "net_weight_in_kg",
DROP COLUMN "quantity_in_bags",
DROP COLUMN "receipt_number",
DROP COLUMN "refraction_humidity_or_quality",
DROP COLUMN "statutory_prerequisite",
DROP COLUMN "total_amount",
DROP COLUMN "unit_amount_per_kg",
ADD COLUMN     "agentName" TEXT NOT NULL,
ADD COLUMN     "agentSignature" TEXT NOT NULL,
ADD COLUMN     "farmerSignature" TEXT NOT NULL,
ADD COLUMN     "gpsLocation" JSONB NOT NULL,
ADD COLUMN     "humidity" TEXT NOT NULL,
ADD COLUMN     "market_number" INTEGER NOT NULL,
ADD COLUMN     "netWeight" INTEGER NOT NULL,
ADD COLUMN     "pricePerKg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "refraction" TEXT NOT NULL,
ADD COLUMN     "salePhotoUrl" TEXT[],
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "price_id",
ADD COLUMN     "grace_period_end" TIMESTAMP(3),
ADD COLUMN     "last_notification_date" TIMESTAMP(3),
ADD COLUMN     "plan_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Training" DROP COLUMN "theme",
DROP COLUMN "training_attendance_sheet_url",
DROP COLUMN "training_picture_url",
ADD COLUMN     "archived_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deployed_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "draft_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "title" TEXT NOT NULL,
DROP COLUMN "modules",
ADD COLUMN     "modules" TEXT[];

-- DropTable
DROP TABLE "Campaign_stock";

-- DropTable
DROP TABLE "Company_training_audit";

-- DropTable
DROP TABLE "Market_audit";

-- DropTable
DROP TABLE "Price_plan_requiement";

-- DropTable
DROP TABLE "Requirement";

-- DropTable
DROP TABLE "Training_participant";

-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "total_drafts" INTEGER NOT NULL,
    "total_archiveds" INTEGER NOT NULL,
    "total_deployeds" INTEGER NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignee" (
    "id" TEXT NOT NULL,
    "agentCode" TEXT NOT NULL,
    "projectCodes" TEXT[],
    "company_id" TEXT NOT NULL,
    "fullName" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company_Campaign" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "farmer_name" TEXT NOT NULL,
    "farmer_contact" TEXT NOT NULL,
    "farmer_ID_card_number" TEXT NOT NULL,
    "inspection_date" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "certification_year" TEXT NOT NULL,
    "inspector_name" TEXT NOT NULL,
    "inspector_contact" TEXT NOT NULL,
    "weed_application" TEXT NOT NULL,
    "weed_application_quantity" INTEGER NOT NULL,
    "pesticide_used" TEXT NOT NULL,
    "pesticide_quantity" INTEGER NOT NULL,
    "farmer_photos" TEXT[],

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance_sheet" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "modules" TEXT[],
    "trainers" TEXT[],
    "trainer_signature" TEXT[],
    "location" TEXT NOT NULL,
    "report_url" TEXT NOT NULL,
    "trainer_proof_of_competency" TEXT[],
    "photos" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "training_id" TEXT NOT NULL,

    CONSTRAINT "Attendance_sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participants" (
    "id" TEXT NOT NULL,
    "attendence_sheet_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "village" TEXT NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assignee_agentCode_key" ON "Assignee"("agentCode");

-- CreateIndex
CREATE UNIQUE INDEX "Assignee_company_id_key" ON "Assignee"("company_id");

-- CreateIndex
CREATE INDEX "Assignee_id_agentCode_company_id_idx" ON "Assignee"("id", "agentCode", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_farmer_ID_card_number_key" ON "Farmer"("farmer_ID_card_number");

-- CreateIndex
CREATE INDEX "Farmer_id_farmer_ID_card_number_farmer_contact_idx" ON "Farmer"("id", "farmer_ID_card_number", "farmer_contact");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_key" ON "Campaign"("name");

-- CreateIndex
CREATE INDEX "Campaign_id_start_date_end_date_status_idx" ON "Campaign"("id", "start_date", "end_date", "status");

-- CreateIndex
CREATE INDEX "Company_id_status_email_idx" ON "Company"("id", "status", "email");

-- CreateIndex
CREATE INDEX "Farm_farmer_id_location_idx" ON "Farm"("farmer_id", "location");

-- CreateIndex
CREATE INDEX "Farm_coordinates_farm_id_location_idx" ON "Farm_coordinates"("farm_id", "location");

-- CreateIndex
CREATE INDEX "Inspection_data_project_id_idx" ON "Inspection_data"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "Market_code_key" ON "Market"("code");

-- CreateIndex
CREATE INDEX "Market_company_id_start_date_end_date_code_idx" ON "Market"("company_id", "start_date", "end_date", "code");

-- CreateIndex
CREATE INDEX "Price_plan_product_name_id_plan_name_status_idx" ON "Price_plan"("product_name", "id", "plan_name", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");

-- CreateIndex
CREATE INDEX "Project_id_company_id_start_date_end_date_sector_activity_t_idx" ON "Project"("id", "company_id", "start_date", "end_date", "sector_activity", "type", "code");

-- CreateIndex
CREATE INDEX "Subscription_company_id_plan_id_status_id_idx" ON "Subscription"("company_id", "plan_id", "status", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Training_code_key" ON "Training"("code");

-- CreateIndex
CREATE INDEX "Training_company_id_start_date_end_date_title_id_idx" ON "Training"("company_id", "start_date", "end_date", "title", "id");

-- CreateIndex
CREATE INDEX "User_id_email_phone_number_idx" ON "User"("id", "email", "phone_number");

-- AddForeignKey
ALTER TABLE "Company_Campaign" ADD CONSTRAINT "Company_Campaign_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company_Campaign" ADD CONSTRAINT "Company_Campaign_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance_sheet" ADD CONSTRAINT "Attendance_sheet_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_attendence_sheet_id_fkey" FOREIGN KEY ("attendence_sheet_id") REFERENCES "Attendance_sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Price_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
