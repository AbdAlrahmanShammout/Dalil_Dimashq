-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('waiting', 'pending', 'confirmed', 'rejected', 'expired', 'cancelled_by_customer', 'cancelled_by_owner', 'attended', 'no_show');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "clientKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "partySize" INTEGER NOT NULL,
    "note" TEXT,
    "offerId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_userId_createdAt_idx" ON "Booking"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_userId_clientKey_key" ON "Booking"("userId", "clientKey");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

