-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('restaurant', 'fast_food', 'cafe', 'hotel', 'guest_house', 'hostel', 'motel');

-- CreateEnum
CREATE TYPE "PlaceStatus" AS ENUM ('active', 'temporarily_closed', 'permanently_closed', 'hidden');

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "type" "PlaceType" NOT NULL,
    "status" "PlaceStatus" NOT NULL DEFAULT 'active',
    "areaId" TEXT NOT NULL,
    "addressAr" TEXT,
    "addressEn" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "starValue" INTEGER,
    "starSource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Place_areaId_idx" ON "Place"("areaId");

-- CreateIndex
CREATE INDEX "Place_status_type_idx" ON "Place"("status", "type");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
