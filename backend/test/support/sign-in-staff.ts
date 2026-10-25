import bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

export async function signInStaff(input: {
  readonly app: INestApplication;
  readonly prisma: PrismaProviderService;
  readonly email: string;
  readonly staffRole: 'admin' | 'editor' | 'moderator' | 'sales';
}): Promise<string> {
  const passwordHash = await bcrypt.hash('Password123', 10);
  await input.prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      staffRole: input.staffRole,
      isVisitor: false,
      isOwner: false,
    },
  });
  const session = await request(input.app.getHttpServer())
    .post('/admin-panel/auth/sign-in')
    .send({ email: input.email, password: 'Password123' })
    .expect(200);
  return session.body.accessToken as string;
}
