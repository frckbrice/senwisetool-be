/*
  Warnings:

  - The values [FARMER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `trainer_ignature` on the `Attendance_sheet` table. All the data in the column will be lost.
  - You are about to drop the column `farmer_code` on the `Farmer` table. All the data in the column will be lost.
  - You are about to drop the column `company_signature` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `farmer_picture_urls` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `farmer_signature` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `humidity_level_of_product` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `net_weight_for_sale` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `net_weight_in_kg` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_in_bags` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `receipt_number` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `refraction_humidity_or_quality` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `statutory_prerequisite` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `Receipt` table. All the data in the column will be lost.
  - You are about to drop the column `unit_amount_per_kg` on the `Receipt` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Market` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trainer_signature` to the `Attendance_sheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_of_theday` to the `Market` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentName` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agentSignature` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farmerSignature` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpsLocation` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `humidity` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `market_number` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netWeight` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerKg` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refraction` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWeight` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PDG', 'EMPLOYEE', 'AGENT', 'ADG', 'AUDITOR', 'SALES', 'IT_SUPPORT');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PDG';
COMMIT;

-- DropIndex
DROP INDEX "Farmer_id_farmer_ID_card_number_idx";

-- DropIndex
DROP INDEX "Market_company_id_start_date_end_date_idx";

-- AlterTable
ALTER TABLE "Attendance_sheet" DROP COLUMN "trainer_ignature",
ADD COLUMN     "trainer_signature" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Farmer" DROP COLUMN "farmer_code";

-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "price_of_theday" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" DROP COLUMN "company_signature",
DROP COLUMN "farmer_picture_urls",
DROP COLUMN "farmer_signature",
DROP COLUMN "humidity_level_of_product",
DROP COLUMN "net_weight_for_sale",
DROP COLUMN "net_weight_in_kg",
DROP COLUMN "quantity_in_bags",
DROP COLUMN "receipt_number",
DROP COLUMN "refraction_humidity_or_quality",
DROP COLUMN "statutory_prerequisite",
DROP COLUMN "total_amount",
DROP COLUMN "unit_amount_per_kg",
ADD COLUMN     "agentName" TEXT NOT NULL,
ADD COLUMN     "agentSignature" TEXT NOT NULL,
ADD COLUMN     "farmerSignature" TEXT NOT NULL,
ADD COLUMN     "gpsLocation" JSONB NOT NULL,
ADD COLUMN     "humidity" TEXT NOT NULL,
ADD COLUMN     "market_number" INTEGER NOT NULL,
ADD COLUMN     "netWeight" INTEGER NOT NULL,
ADD COLUMN     "pricePerKg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "refraction" TEXT NOT NULL,
ADD COLUMN     "salePhotoUrl" TEXT[],
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalWeight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "Farmer_id_farmer_ID_card_number_farmer_contact_idx" ON "Farmer"("id", "farmer_ID_card_number", "farmer_contact");

-- CreateIndex
CREATE UNIQUE INDEX "Market_code_key" ON "Market"("code");

-- CreateIndex
CREATE INDEX "Market_company_id_start_date_end_date_code_idx" ON "Market"("company_id", "start_date", "end_date", "code");
