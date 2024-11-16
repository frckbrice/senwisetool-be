/*
  Warnings:

  - You are about to drop the column `nom_fournisseur` on the `Market` table. All the data in the column will be lost.
  - Added the required column `supplier` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignee" ADD COLUMN     "project_type" TEXT;

-- AlterTable
ALTER TABLE "Market" DROP COLUMN "nom_fournisseur",
ADD COLUMN     "supplier" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';
