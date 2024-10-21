/*
  Warnings:

  - You are about to drop the column `company_id` on the `Assignee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Assignee" DROP CONSTRAINT "Assignee_company_id_fkey";

-- AlterTable
ALTER TABLE "Assignee" DROP COLUMN "company_id";
