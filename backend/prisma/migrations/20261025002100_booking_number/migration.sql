-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_number_key" ON "Booking"("number");

