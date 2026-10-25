-- CreateTable
CREATE TABLE "PlaceOwner" (
    "placeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaceOwner_pkey" PRIMARY KEY ("placeId","userId")
);

-- CreateIndex
CREATE INDEX "PlaceOwner_userId_idx" ON "PlaceOwner"("userId");

-- AddForeignKey
ALTER TABLE "PlaceOwner" ADD CONSTRAINT "PlaceOwner_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceOwner" ADD CONSTRAINT "PlaceOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

