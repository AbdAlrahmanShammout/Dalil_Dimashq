-- CreateTable
CREATE TABLE "BookingBan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),

    CONSTRAINT "BookingBan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingBan_userId_idx" ON "BookingBan"("userId");

-- AddForeignKey
ALTER TABLE "BookingBan" ADD CONSTRAINT "BookingBan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

