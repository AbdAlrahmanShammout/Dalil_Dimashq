-- CreateTable
CREATE TABLE "RecentPlace" (
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentPlace_pkey" PRIMARY KEY ("userId","placeId")
);

-- CreateIndex
CREATE INDEX "RecentPlace_userId_viewedAt_idx" ON "RecentPlace"("userId", "viewedAt");

-- AddForeignKey
ALTER TABLE "RecentPlace" ADD CONSTRAINT "RecentPlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentPlace" ADD CONSTRAINT "RecentPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

