/*
  Warnings:

  - You are about to drop the column `theme` on the `Training` table. All the data in the column will be lost.
  - The `modules` column on the `Training` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `training_attendance_sheet_url` column on the `Training` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Training_participant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `report_url` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Training_participant" DROP CONSTRAINT "Training_participant_training_id_fkey";

-- AlterTable
ALTER TABLE "Training" DROP COLUMN "theme",
ADD COLUMN     "report_url" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "trainer_proof_of_competency" TEXT[],
DROP COLUMN "modules",
ADD COLUMN     "modules" TEXT[],
DROP COLUMN "training_attendance_sheet_url",
ADD COLUMN     "training_attendance_sheet_url" TEXT[];

-- DropTable
DROP TABLE "Training_participant";

-- CreateTable
CREATE TABLE "training_session" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "training_id" TEXT NOT NULL,

    CONSTRAINT "training_session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "training_session" ADD CONSTRAINT "training_session_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
