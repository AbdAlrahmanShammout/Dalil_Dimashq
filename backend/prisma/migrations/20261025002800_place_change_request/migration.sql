-- CreateEnum
CREATE TYPE "PlaceChangeKind" AS ENUM ('claim', 'edit', 'remove', 'report', 'unlink');

-- CreateEnum
CREATE TYPE "PlaceChangeStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "PlaceChangeRequest" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "PlaceChangeKind" NOT NULL,
    "status" "PlaceChangeStatus" NOT NULL DEFAULT 'pending',
    "reason" TEXT,
    "payload" JSONB,
    "decisionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),

    CONSTRAINT "PlaceChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlaceChangeRequest_placeId_status_idx" ON "PlaceChangeRequest"("placeId", "status");

-- CreateIndex
CREATE INDEX "PlaceChangeRequest_userId_idx" ON "PlaceChangeRequest"("userId");

-- AddForeignKey
ALTER TABLE "PlaceChangeRequest" ADD CONSTRAINT "PlaceChangeRequest_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceChangeRequest" ADD CONSTRAINT "PlaceChangeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

