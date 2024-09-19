-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "another_logo" TEXT;

-- AlterTable
ALTER TABLE "Project_audit" ADD COLUMN     "action" "ProjectStatus" NOT NULL DEFAULT 'DRAFT';
