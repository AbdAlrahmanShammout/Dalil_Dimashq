-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subscription_placeId_endsAt_idx" ON "Subscription"("placeId", "endsAt");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

