-- CreateEnum
CREATE TYPE "HourSeason" AS ENUM ('regular', 'ramadan');

-- AlterTable
ALTER TABLE "PlaceHour" ADD COLUMN     "season" "HourSeason" NOT NULL DEFAULT 'regular';

-- CreateTable
CREATE TABLE "RamadanSeason" (
    "id" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RamadanSeason_pkey" PRIMARY KEY ("id")
);

