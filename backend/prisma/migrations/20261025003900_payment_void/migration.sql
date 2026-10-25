-- CreateTable
CREATE TABLE "PaymentVoid" (
    "paymentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "voidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentVoid_pkey" PRIMARY KEY ("paymentId")
);

-- AddForeignKey
ALTER TABLE "PaymentVoid" ADD CONSTRAINT "PaymentVoid_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

