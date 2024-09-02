/*
  Warnings:

  - Added the required column `city` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_paypal_id_key";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "paypal_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
