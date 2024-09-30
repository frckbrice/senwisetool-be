-- CreateTable
CREATE TABLE "Statistics" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "total_drafts" INTEGER NOT NULL,
    "total_archiveds" INTEGER NOT NULL,
    "total_deployeds" INTEGER NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);
