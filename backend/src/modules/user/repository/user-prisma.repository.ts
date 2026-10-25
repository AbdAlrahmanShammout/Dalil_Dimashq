import { Injectable } from '@nestjs/common';
import { Prisma, StaffRole as PrismaStaffRole } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-runner';
import {
  CreateEmailCodeRepoInput,
  CreateRefreshTokenRepoInput,
  CreateUserRepoInput,
  EmailCodeRecord,
  FindEmailCodeRepoInput,
  RefreshTokenRecord,
  RevokeAudienceTokensRepoInput,
  UpdateDoorRepoInput,
  UpdatePasswordRepoInput,
} from '@/modules/user/defs/user.defs';
import { UserEntity } from '@/modules/user/entity/user.entity';
import { UserMapper } from '@/modules/user/mapper/user.mapper';
import {
  CompleteProfileRepoInput,
  UserRepository,
} from '@/modules/user/repository/user.repository';
import { userDetailsInclude } from '@/modules/user/types/user-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';

type DatabaseClient = Prisma.TransactionClient | PrismaProviderService;

@Injectable()
export class UserPrismaRepository extends UserRepository {
  constructor(private readonly prisma: PrismaProviderService) {
    super();
  }

  async findById(id: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { id }, include: userDetailsInclude });
    return row ? UserMapper.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({
      where: { email },
      include: userDetailsInclude,
    });
    return row ? UserMapper.toEntity(row) : null;
  }

  async create(input: CreateUserRepoInput, context?: TransactionContext) {
    const row = await this.client(context).user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        isVisitor: input.isVisitor,
        isOwner: input.isOwner,
        emailVerifiedAt: input.emailVerifiedAt ?? null,
        staffRole: (input.staffRole ?? null) as PrismaStaffRole | null,
        profile: { create: {} },
      },
      include: userDetailsInclude,
    });
    return UserMapper.toEntity(row);
  }

  async updateDoor(input: UpdateDoorRepoInput, context?: TransactionContext) {
    const data: Prisma.UserUpdateInput = {};
    if (input.isVisitor !== undefined) {
      data.isVisitor = input.isVisitor;
    }
    if (input.isOwner !== undefined) {
      data.isOwner = input.isOwner;
    }
    if (input.emailVerifiedAt !== undefined) {
      data.emailVerifiedAt = input.emailVerifiedAt;
    }
    const row = await this.client(context).user.update({
      where: { id: input.id },
      data,
      include: userDetailsInclude,
    });
    return UserMapper.toEntity(row);
  }

  async updatePassword(input: UpdatePasswordRepoInput, context?: TransactionContext) {
    const row = await this.client(context).user.update({
      where: { id: input.id },
      data: { passwordHash: input.passwordHash, tokenVersion: { increment: 1 } },
      include: userDetailsInclude,
    });
    return UserMapper.toEntity(row);
  }

  async createEmailCode(
    input: CreateEmailCodeRepoInput,
    context?: TransactionContext,
  ): Promise<void> {
    await this.client(context).emailCode.create({
      data: {
        userId: input.userId,
        audience: input.audience,
        purpose: input.purpose,
        codeHash: input.codeHash,
        expiresAt: input.expiresAt,
      },
    });
  }

  async findLatestEmailCode(input: FindEmailCodeRepoInput): Promise<EmailCodeRecord | null> {
    return this.prisma.emailCode.findFirst({
      where: { userId: input.userId, audience: input.audience, purpose: input.purpose },
      orderBy: { createdAt: 'desc' },
      select: { id: true, codeHash: true, expiresAt: true, consumedAt: true },
    });
  }

  async consumeEmailCode(id: string, context?: TransactionContext): Promise<void> {
    await this.client(context).emailCode.update({
      where: { id },
      data: { consumedAt: new Date() },
    });
  }

  async createRefreshToken(
    input: CreateRefreshTokenRepoInput,
    context?: TransactionContext,
  ): Promise<void> {
    await this.client(context).refreshToken.create({
      data: {
        userId: input.userId,
        audience: input.audience,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshTokenRecord | null> {
    return this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: { id: true, userId: true, audience: true, expiresAt: true, revokedAt: true },
    });
  }

  async revokeRefreshToken(id: string, context?: TransactionContext): Promise<void> {
    await this.client(context).refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAudienceRefreshTokens(
    input: RevokeAudienceTokensRepoInput,
    context?: TransactionContext,
  ): Promise<void> {
    await this.client(context).refreshToken.updateMany({
      where: { userId: input.userId, audience: input.audience, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllRefreshTokens(userId: string, context?: TransactionContext): Promise<void> {
    await this.client(context).refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async deleteById(id: string, context?: TransactionContext): Promise<void> {
    await this.client(context).user.delete({ where: { id } });
  }

  override async findByPhone(phone: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findFirst({
      where: { profile: { phone } },
      include: userDetailsInclude,
    });
    return row ? UserMapper.toEntity(row) : null;
  }

  override async completeProfile(input: CompleteProfileRepoInput): Promise<UserEntity> {
    const row = await this.prisma.user.update({
      where: { id: input.userId },
      data: {
        profile: {
          update: {
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
            birthYear: input.birthYear,
            language: input.language,
          },
        },
      },
      include: userDetailsInclude,
    });
    return UserMapper.toEntity(row);
  }

  private client(context?: TransactionContext): DatabaseClient {
    return (context as Prisma.TransactionClient | undefined) ?? this.prisma;
  }
}
