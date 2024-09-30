/*
  Warnings:

  - The values [EXTERNAL_INSPECTION] on the enum `TypeProject` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeProject_new" AS ENUM ('INITIAL_INSPECTION', 'INTERNAL_INSPECTION', 'AUTO_EVALUATION', 'MAPPING');
ALTER TABLE "Project" ALTER COLUMN "type" TYPE "TypeProject_new" USING ("type"::text::"TypeProject_new");
ALTER TABLE "Project_audit" ALTER COLUMN "type_of_project" TYPE "TypeProject_new" USING ("type_of_project"::text::"TypeProject_new");
ALTER TYPE "TypeProject" RENAME TO "TypeProject_old";
ALTER TYPE "TypeProject_new" RENAME TO "TypeProject";
DROP TYPE "TypeProject_old";
COMMIT;

-- DropIndex
DROP INDEX "Campaign_id_idx";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "status" SET DEFAULT 'CLOSED';

-- CreateIndex
CREATE INDEX "Campaign_id_start_date_end_date_status_idx" ON "Campaign"("id", "start_date", "end_date", "status");
