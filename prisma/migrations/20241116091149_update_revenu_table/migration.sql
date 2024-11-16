/*
  Warnings:

  - You are about to drop the column `activity_title` on the `RevenuEtResponsabilitePartager` table. All the data in the column will be lost.
  - You are about to drop the column `documenents_url` on the `RevenuEtResponsabilitePartager` table. All the data in the column will be lost.
  - You are about to drop the column `pictures_url` on the `RevenuEtResponsabilitePartager` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RevenuEtResponsabilitePartager" DROP COLUMN "activity_title",
DROP COLUMN "documenents_url",
DROP COLUMN "pictures_url",
ADD COLUMN     "agreement_pv" TEXT[],
ADD COLUMN     "first_buyer_proof" TEXT[],
ADD COLUMN     "management_plan" TEXT[],
ADD COLUMN     "producer_payment_proof" TEXT[],
ADD COLUMN     "proof_of_expenses" TEXT[],
ADD COLUMN     "proof_of_paiement" TEXT[];
