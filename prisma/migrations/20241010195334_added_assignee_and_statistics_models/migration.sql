/*
  Warnings:

  - You are about to drop the column `collected_by` on the `Inspection_data` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Inspection_data` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Inspection_data_project_id_collected_by_idx";

-- AlterTable
ALTER TABLE "Inspection_data" DROP COLUMN "collected_by",
DROP COLUMN "created_at",
ADD COLUMN     "collected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Inspection_data_project_id_idx" ON "Inspection_data"("project_id");
