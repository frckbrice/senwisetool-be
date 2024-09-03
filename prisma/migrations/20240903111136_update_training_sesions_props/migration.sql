/*
  Warnings:

  - You are about to drop the column `report_url` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `trainer_proof_of_competency` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `training_attendance_sheet_url` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `training_picture_url` on the `Training` table. All the data in the column will be lost.
  - Added the required column `report_url` to the `training_session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "report_url",
DROP COLUMN "trainer_proof_of_competency",
DROP COLUMN "training_attendance_sheet_url",
DROP COLUMN "training_picture_url";

-- AlterTable
ALTER TABLE "training_session" ADD COLUMN     "report_url" TEXT NOT NULL,
ADD COLUMN     "trainer_proof_of_competency" TEXT[],
ADD COLUMN     "training_attendance_sheet_urls" TEXT[],
ADD COLUMN     "training_picture_url" TEXT[];
