-- AlterTable
ALTER TABLE "FakeReport" ADD COLUMN     "bookingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FakeReport_bookingId_key" ON "FakeReport"("bookingId");

-- CreateIndex
CREATE INDEX "FakeReport_placeId_createdAt_idx" ON "FakeReport"("placeId", "createdAt");

-- AddForeignKey
ALTER TABLE "FakeReport" ADD CONSTRAINT "FakeReport_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

