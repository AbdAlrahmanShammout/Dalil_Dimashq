-- AlterTable
ALTER TABLE "FakeReport" ADD COLUMN     "badFaith" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "decidedAt" TIMESTAMP(3),
ADD COLUMN     "decisionNote" TEXT;

