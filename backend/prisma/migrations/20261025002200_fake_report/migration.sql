-- CreateEnum
CREATE TYPE "FakeReportStatus" AS ENUM ('open', 'confirmed', 'rejected');

-- CreateTable
CREATE TABLE "FakeReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "status" "FakeReportStatus" NOT NULL DEFAULT 'open',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FakeReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FakeReportReply" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FakeReportReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FakeReport_userId_status_idx" ON "FakeReport"("userId", "status");

-- CreateIndex
CREATE INDEX "FakeReportReply_reportId_idx" ON "FakeReportReply"("reportId");

-- AddForeignKey
ALTER TABLE "FakeReport" ADD CONSTRAINT "FakeReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FakeReport" ADD CONSTRAINT "FakeReport_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FakeReportReply" ADD CONSTRAINT "FakeReportReply_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "FakeReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

