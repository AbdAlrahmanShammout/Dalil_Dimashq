-- CreateEnum
CREATE TYPE "LegalKind" AS ENUM ('terms', 'privacy');

-- CreateTable
CREATE TABLE "LegalDocument" (
    "id" TEXT NOT NULL,
    "kind" "LegalKind" NOT NULL,
    "language" "ProfileLanguage" NOT NULL,
    "body" TEXT NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LegalDocument_kind_language_isCurrent_idx" ON "LegalDocument"("kind", "language", "isCurrent");

