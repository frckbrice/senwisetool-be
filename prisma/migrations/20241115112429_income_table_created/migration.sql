-- CreateEnum
CREATE TYPE "IncomeAndShareResponsabilityType" AS ENUM ('PAYMENT_JUSTIFICATION', 'SUSTENABILITY_DIFFERENTIAL', 'INVESTMENT_MANAGEMENT_PLAN');

-- CreateTable
CREATE TABLE "RevenuEtResponsabilitePartager" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "activity_title" TEXT,
    "pictures_url" TEXT[],
    "documenents_url" TEXT[],
    "pv_url" TEXT[],
    "type" "IncomeAndShareResponsabilityType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenuEtResponsabilitePartager_pkey" PRIMARY KEY ("id")
);
