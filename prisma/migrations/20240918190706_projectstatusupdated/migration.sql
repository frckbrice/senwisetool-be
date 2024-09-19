/*
  Warnings:

  - Added the required column `campaign_id` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "campaign_id" TEXT NOT NULL;
