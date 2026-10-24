-- CreateTable
CREATE TABLE "PlaceHour" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "opensAt" INTEGER NOT NULL,
    "closesAt" INTEGER NOT NULL,

    CONSTRAINT "PlaceHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlaceHour_placeId_dayOfWeek_idx" ON "PlaceHour"("placeId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "PlaceHour" ADD CONSTRAINT "PlaceHour_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
