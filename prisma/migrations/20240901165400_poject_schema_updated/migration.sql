/*
  Warnings:

  - You are about to drop the column `archived` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `draft` on the `Project` table. All the data in the column will be lost.
  - Added the required column `deployed_at` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `project_structure` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "CompanyStatus" ADD VALUE 'EXPIRED';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "archived",
DROP COLUMN "draft",
ADD COLUMN     "deployed_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "project_structure" SET NOT NULL;
