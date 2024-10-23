/*
  Warnings:

  - You are about to drop the column `estimate_area` on the `Farm` table. All the data in the column will be lost.
  - Added the required column `surface_area` to the `Farm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Farm" DROP COLUMN "estimate_area",
ADD COLUMN     "surface_area" DOUBLE PRECISION NOT NULL;
