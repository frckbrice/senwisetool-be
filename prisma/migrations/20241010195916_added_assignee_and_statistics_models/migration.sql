-- CreateTable
CREATE TABLE "Assignee" (
    "id" TEXT NOT NULL,
    "code" TEXT[],
    "user_id" TEXT,
    "role" "Role",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignee_pkey" PRIMARY KEY ("id")
);
