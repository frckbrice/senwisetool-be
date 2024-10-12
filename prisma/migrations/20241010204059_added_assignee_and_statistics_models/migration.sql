/*
  Warnings:

  - You are about to drop the column `user_id` on the `Assignee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agentCode]` on the table `Assignee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Assignee" DROP COLUMN "user_id";

-- CreateIndex
CREATE UNIQUE INDEX "Assignee_agentCode_key" ON "Assignee"("agentCode");
