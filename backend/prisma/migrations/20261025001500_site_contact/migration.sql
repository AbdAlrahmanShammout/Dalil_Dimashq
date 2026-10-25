-- CreateTable
CREATE TABLE "SiteContact" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "whatsapp" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,

    CONSTRAINT "SiteContact_pkey" PRIMARY KEY ("id")
);

