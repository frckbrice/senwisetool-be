-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'DEPLOYED';

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "grace_period_end" DROP NOT NULL;
