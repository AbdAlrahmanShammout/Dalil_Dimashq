-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceAmenity" (
    "placeId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlaceAmenity_pkey" PRIMARY KEY ("placeId","amenityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_code_key" ON "Amenity"("code");

-- CreateIndex
CREATE INDEX "PlaceAmenity_placeId_sortOrder_idx" ON "PlaceAmenity"("placeId", "sortOrder");

-- AddForeignKey
ALTER TABLE "PlaceAmenity" ADD CONSTRAINT "PlaceAmenity_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceAmenity" ADD CONSTRAINT "PlaceAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
