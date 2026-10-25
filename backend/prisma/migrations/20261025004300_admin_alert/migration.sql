-- CreateTable
CREATE TABLE "AdminAlert" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "targetId" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAlert_readAt_createdAt_idx" ON "AdminAlert"("readAt", "createdAt");

