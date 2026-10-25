-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('open', 'done', 'dismissed');

-- AlterTable
ALTER TABLE "Suggestion" ADD COLUMN     "status" "SuggestionStatus" NOT NULL DEFAULT 'open';

-- CreateIndex
CREATE INDEX "Suggestion_status_createdAt_idx" ON "Suggestion"("status", "createdAt");

