-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "detailsAr" TEXT NOT NULL,
    "detailsEn" TEXT NOT NULL,
    "imageKey" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Offer_placeId_endsAt_idx" ON "Offer"("placeId", "endsAt");

-- CreateIndex
CREATE INDEX "Offer_published_startsAt_endsAt_idx" ON "Offer"("published", "startsAt", "endsAt");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
