-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "claimCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Place_claimCode_key" ON "Place"("claimCode");

