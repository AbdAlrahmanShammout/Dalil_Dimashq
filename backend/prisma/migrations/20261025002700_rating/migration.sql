-- CreateEnum
CREATE TYPE "RatingStatus" AS ENUM ('held', 'counted', 'rejected');

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "status" "RatingStatus" NOT NULL DEFAULT 'held',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Rating_placeId_status_idx" ON "Rating"("placeId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_placeId_key" ON "Rating"("userId", "placeId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

