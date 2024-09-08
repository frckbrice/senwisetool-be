/*
  Warnings:

  - You are about to drop the column `numero` on the `Requirement` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Requirement` table. All the data in the column will be lost.
  - Added the required column `name` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Requirement" DROP COLUMN "numero",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;
