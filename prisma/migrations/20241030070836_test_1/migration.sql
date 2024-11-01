/*
  Warnings:

  - Added the required column `updated_at` to the `Agriculture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Environment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Social` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agriculture" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Environment" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Social" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
