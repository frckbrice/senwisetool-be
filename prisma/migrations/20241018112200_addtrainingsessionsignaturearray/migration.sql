/*
  Warnings:

  - The `trainer_signature` column on the `Attendance_sheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Attendance_sheet" DROP COLUMN "trainer_signature",
ADD COLUMN     "trainer_signature" TEXT[];
