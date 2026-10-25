-- CreateEnum
CREATE TYPE "PlacePhotoRole" AS ENUM ('gallery', 'cover', 'logo');

-- CreateTable
CREATE TABLE "PlacePhoto" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "role" "PlacePhotoRole" NOT NULL DEFAULT 'gallery',
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlacePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlacePhoto_placeId_sortOrder_idx" ON "PlacePhoto"("placeId", "sortOrder");

-- AddForeignKey
ALTER TABLE "PlacePhoto" ADD CONSTRAINT "PlacePhoto_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
