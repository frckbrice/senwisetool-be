/*
  Warnings:

  - Added the required column `council` to the `Farmer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Farmer" ADD COLUMN     "council" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
