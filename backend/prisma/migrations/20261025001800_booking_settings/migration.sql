-- CreateTable
CREATE TABLE "PlaceBookingSettings" (
    "placeId" TEXT NOT NULL,
    "acceptsBookings" BOOLEAN NOT NULL DEFAULT false,
    "horizonDays" INTEGER NOT NULL DEFAULT 14,
    "noticeMinutes" INTEGER NOT NULL DEFAULT 60,
    "maxParty" INTEGER NOT NULL DEFAULT 8,
    "replyWindowMinutes" INTEGER NOT NULL DEFAULT 60,

    CONSTRAINT "PlaceBookingSettings_pkey" PRIMARY KEY ("placeId")
);

-- CreateTable
CREATE TABLE "BookingBlackout" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingBlackout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingResponseHour" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "opensAt" INTEGER NOT NULL,
    "closesAt" INTEGER NOT NULL,

    CONSTRAINT "BookingResponseHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingBlackout_placeId_idx" ON "BookingBlackout"("placeId");

-- CreateIndex
CREATE INDEX "BookingResponseHour_placeId_dayOfWeek_idx" ON "BookingResponseHour"("placeId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "PlaceBookingSettings" ADD CONSTRAINT "PlaceBookingSettings_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingBlackout" ADD CONSTRAINT "BookingBlackout_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingResponseHour" ADD CONSTRAINT "BookingResponseHour_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

