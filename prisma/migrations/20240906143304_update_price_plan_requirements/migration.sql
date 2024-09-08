/*
  Warnings:

  - You are about to drop the column `label` on the `Requirement` table. All the data in the column will be lost.
  - You are about to drop the `Price_plan_requiement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `numero` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Price_plan_requiement" DROP CONSTRAINT "Price_plan_requiement_price_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "Price_plan_requiement" DROP CONSTRAINT "Price_plan_requiement_req_id_fkey";

-- AlterTable
ALTER TABLE "Requirement" DROP COLUMN "label",
ADD COLUMN     "numero" TEXT NOT NULL;

-- DropTable
DROP TABLE "Price_plan_requiement";

-- CreateTable
CREATE TABLE "Price_plan_requirement" (
    "id" TEXT NOT NULL,
    "req_id" TEXT NOT NULL,
    "price_plan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_plan_requirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Price_plan_requirement_req_id_price_plan_id_idx" ON "Price_plan_requirement"("req_id", "price_plan_id");

-- AddForeignKey
ALTER TABLE "Price_plan_requirement" ADD CONSTRAINT "Price_plan_requirement_req_id_fkey" FOREIGN KEY ("req_id") REFERENCES "Requirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price_plan_requirement" ADD CONSTRAINT "Price_plan_requirement_price_plan_id_fkey" FOREIGN KEY ("price_plan_id") REFERENCES "Price_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
