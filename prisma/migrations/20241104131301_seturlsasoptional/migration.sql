-- AlterTable
ALTER TABLE "Market" ALTER COLUMN "bordereau_vente_url" DROP NOT NULL,
ALTER COLUMN "bon_entree_magazin_url" DROP NOT NULL,
ALTER COLUMN "accompanying_url" DROP NOT NULL,
ALTER COLUMN "transmission_url" DROP NOT NULL,
ALTER COLUMN "product_quantity" DROP NOT NULL;
