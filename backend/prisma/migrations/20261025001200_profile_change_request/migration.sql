-- CreateEnum
CREATE TYPE "ProfileChangeKind" AS ENUM ('name', 'birth_year');

-- CreateEnum
CREATE TYPE "ProfileChangeStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "ProfileChangeRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "ProfileChangeKind" NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthYear" INTEGER,
    "status" "ProfileChangeStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileChangeRequest_userId_status_idx" ON "ProfileChangeRequest"("userId", "status");

-- AddForeignKey
ALTER TABLE "ProfileChangeRequest" ADD CONSTRAINT "ProfileChangeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
