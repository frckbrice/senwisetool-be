/*
  Warnings:

  - You are about to drop the column `trainer_proof_of_competency` on the `Attendance_sheet` table. All the data in the column will be lost.
  - You are about to drop the column `trainer_signature` on the `Attendance_sheet` table. All the data in the column will be lost.
  - The `trainers` column on the `Attendance_sheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Attendance_sheet" DROP COLUMN "trainer_proof_of_competency",
DROP COLUMN "trainer_signature",
DROP COLUMN "trainers",
ADD COLUMN     "trainers" JSONB NOT NULL DEFAULT '[{}]';
