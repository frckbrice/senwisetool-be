/*
  Warnings:

  - You are about to drop the column `state` on the `Project` table. All the data in the column will be lost.
  - Added the required column `region` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `Statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "state",
ADD COLUMN     "region" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "project_id" TEXT NOT NULL;
