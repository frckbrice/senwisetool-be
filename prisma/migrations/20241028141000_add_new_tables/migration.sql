/*
  Warnings:

  - Added the required column `nom_fournisseur` to the `Market` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Market" ADD COLUMN     "nom_fournisseur" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Agriculture" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "activity_title" TEXT NOT NULL,
    "pictures_url" TEXT[],
    "documents_url" TEXT[],
    "pv_url" TEXT[],

    CONSTRAINT "Agriculture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Social" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "activity_title" TEXT NOT NULL,
    "pictures_url" TEXT[],
    "documents_url" TEXT[],
    "pv_url" TEXT[],

    CONSTRAINT "Social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Environment" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "activity_title" TEXT NOT NULL,
    "pictures_url" TEXT[],
    "documents_url" TEXT[],
    "pv_url" TEXT[],

    CONSTRAINT "Environment_pkey" PRIMARY KEY ("id")
);
