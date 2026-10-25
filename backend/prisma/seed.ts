import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@dalil.test';
const SEED_PASSWORD = 'Password123';
const BCRYPT_ROUNDS = 10;

const AMENITIES = [
  { code: 'wifi', nameAr: 'واي فاي', nameEn: 'Wi-Fi', sortOrder: 1 },
  { code: 'parking', nameAr: 'موقف', nameEn: 'Parking', sortOrder: 2 },
  { code: 'outdoor', nameAr: 'جلسة خارجية', nameEn: 'Outdoor seating', sortOrder: 3 },
  { code: 'family', nameAr: 'مناسب للعائلات', nameEn: 'Family friendly', sortOrder: 4 },
  { code: 'delivery', nameAr: 'توصيل', nameEn: 'Delivery', sortOrder: 5 },
  { code: 'card', nameAr: 'دفع بالبطاقة', nameEn: 'Card payment', sortOrder: 6 },
] as const;

const LEGAL_DOCUMENTS = [
  {
    kind: 'terms' as const,
    language: 'ar' as const,
    body: 'شروط استخدام دليل دمشق. باستخدام الخدمة توافق على هذه الشروط.',
  },
  {
    kind: 'privacy' as const,
    language: 'ar' as const,
    body: 'سياسة خصوصية دليل دمشق. نستخدم بيانات الحساب لتشغيل الدليل والحجوزات.',
  },
] as const;

const prisma = new PrismaClient();

async function seedAdmin(): Promise<void> {
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, BCRYPT_ROUNDS);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash,
      staffRole: 'admin',
      isVisitor: false,
      isOwner: false,
      emailVerifiedAt: new Date(),
    },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      staffRole: 'admin',
      isVisitor: false,
      isOwner: false,
      emailVerifiedAt: new Date(),
    },
  });
}

async function seedAmenities(): Promise<void> {
  for (const amenity of AMENITIES) {
    await prisma.amenity.upsert({
      where: { code: amenity.code },
      update: { nameAr: amenity.nameAr, nameEn: amenity.nameEn, sortOrder: amenity.sortOrder },
      create: amenity,
    });
  }
}

async function seedLegal(): Promise<void> {
  for (const document of LEGAL_DOCUMENTS) {
    const current = await prisma.legalDocument.findFirst({
      where: { kind: document.kind, language: document.language, isCurrent: true },
    });
    if (current) {
      continue;
    }
    await prisma.legalDocument.create({ data: { ...document, isCurrent: true } });
  }
}

async function seedSiteContact(): Promise<void> {
  await prisma.siteContact.upsert({
    where: { id: 'site' },
    update: {},
    create: { id: 'site' },
  });
}

async function main(): Promise<void> {
  await seedAdmin();
  await seedAmenities();
  await seedLegal();
  await seedSiteContact();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
