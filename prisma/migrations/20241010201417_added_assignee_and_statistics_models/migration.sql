/*
  Warnings:

  - You are about to drop the column `code` on the `Assignee` table. All the data in the column will be lost.
  - You are about to drop the column `projects` on the `Assignee` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Assignee` table. All the data in the column will be lost.
  - Added the required column `agentCode` to the `Assignee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignee" DROP COLUMN "code",
DROP COLUMN "projects",
DROP COLUMN "role",
ADD COLUMN     "agentCode" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "projectCodes" TEXT[];
