/*
  Warnings:

  - You are about to drop the column `code` on the `Collector_agent` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Collector_agent` table. All the data in the column will be lost.
  - You are about to drop the column `mapping_date` on the `Farm_coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `collected_at` on the `Inspection_data` table. All the data in the column will be lost.
  - You are about to drop the column `project_data_url` on the `Inspection_data` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `Collector_agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_code` to the `Collector_agent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project_id_company_id_start_date_end_date_sector_activity_t_idx";

-- AlterTable
ALTER TABLE "Collector_agent" DROP COLUMN "code",
DROP COLUMN "companyId",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD COLUMN     "project_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Farm_coordinates" DROP COLUMN "mapping_date";

-- AlterTable
ALTER TABLE "Inspection_data" DROP COLUMN "collected_at",
DROP COLUMN "project_data_url";

-- CreateIndex
CREATE INDEX "Project_id_company_id_start_date_end_date_sector_activity_t_idx" ON "Project"("id", "company_id", "start_date", "end_date", "sector_activity", "type", "code");
