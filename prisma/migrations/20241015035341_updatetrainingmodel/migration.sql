/*
  Warnings:

  - You are about to drop the column `council` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `Farm` table. All the data in the column will be lost.
  - You are about to drop the column `collected_by` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `estimate_area` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `located_at` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Company_training_audit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training_session` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Training` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estimate_area` to the `Farm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantation_creation_date` to the `Farm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collector_name` to the `Farm_coordinates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `archived_at` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deleted_at` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deployed_at` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TypeProject" ADD VALUE 'TRAINING';

-- DropForeignKey
ALTER TABLE "Company_training_audit" DROP CONSTRAINT "Company_training_audit_training_id_fkey";

-- DropForeignKey
ALTER TABLE "Company_training_audit" DROP CONSTRAINT "Company_training_audit_user_id_fkey";

-- DropForeignKey
ALTER TABLE "training_session" DROP CONSTRAINT "training_session_training_id_fkey";

-- DropIndex
DROP INDEX "Farm_coordinates_farm_id_located_at_idx";

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
ADD COLUMN     "collector_name" TEXT NOT NULL,
ADD COLUMN     "location" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "created_at",
ALTER COLUMN "draft_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "archived_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deployed_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "draft_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "slug" DROP NOT NULL;

-- DropTable
DROP TABLE "Company_training_audit";

-- DropTable
DROP TABLE "training_session";

-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "farmer_name" TEXT NOT NULL,
    "farmer_contact" TEXT NOT NULL,
    "farmer_code" TEXT NOT NULL,
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
    "trainer_ignature" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "Farmer_farmer_ID_card_number_key" ON "Farmer"("farmer_ID_card_number");

-- CreateIndex
CREATE INDEX "Farmer_id_farmer_ID_card_number_idx" ON "Farmer"("id", "farmer_ID_card_number");

-- CreateIndex
CREATE INDEX "Farm_coordinates_farm_id_location_idx" ON "Farm_coordinates"("farm_id", "location");

-- CreateIndex
CREATE UNIQUE INDEX "Training_code_key" ON "Training"("code");

-- AddForeignKey
ALTER TABLE "Attendance_sheet" ADD CONSTRAINT "Attendance_sheet_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_attendence_sheet_id_fkey" FOREIGN KEY ("attendence_sheet_id") REFERENCES "Attendance_sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
