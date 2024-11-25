-- DropIndex
DROP INDEX "Receipt_market_id_key";



-- -- add culumn bucket_name in table company
-- ALTER TABLE "Company" ADD COLUMN "company_bucket" TEXT;
-- UPDATE "Company" SET "company_bucket" = 'unknown' WHERE "company_bucket" IS NULL;
