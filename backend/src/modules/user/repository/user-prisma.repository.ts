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
  CreateProfileChangeRepoInput,
  ProfileChangeRow,
  StaffAccountRow,
  UserContacts,
  UpdateProfileContactRepoInput,
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

  override async updateProfileContact(input: UpdateProfileContactRepoInput): Promise<UserEntity> {
    const row = await this.prisma.user.update({
      where: { id: input.userId },
      data: {
        profile: {
          update: {
            ...(input.phone !== undefined ? { phone: input.phone } : {}),
            ...(input.clearPhoneVerified ? { phoneVerifiedAt: null } : {}),
            ...(input.language !== undefined ? { language: input.language } : {}),
          },
        },
      },
      include: userDetailsInclude,
    });
    return UserMapper.toEntity(row);
  }

  override async hasPendingProfileChange(userId: string): Promise<boolean> {
    const count = await this.prisma.profileChangeRequest.count({
      where: { userId, status: 'pending' },
    });
    return count > 0;
  }

  override async createProfileChange(input: CreateProfileChangeRepoInput): Promise<{ id: string }> {
    const row = await this.prisma.profileChangeRequest.create({
      data: {
        userId: input.userId,
        kind: input.kind,
        firstName: input.firstName,
        lastName: input.lastName,
        birthYear: input.birthYear,
      },
    });
    return { id: row.id };
  }

  override async listStaff(): Promise<StaffAccountRow[]> {
    const rows = await this.prisma.user.findMany({
      where: { staffRole: { not: null } },
      orderBy: { email: 'asc' },
    });
    return rows.flatMap((row) =>
      row.staffRole === null ? [] : [{ id: row.id, email: row.email, staffRole: row.staffRole }],
    );
  }

  override async findContacts(id: string): Promise<UserContacts | null> {
    const row = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        profile: { select: { phone: true } },
      },
    });
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      email: row.email,
      phone: row.profile?.phone ?? null,
      emailVerified: row.emailVerifiedAt !== null,
    };
  }

  override async findProfileChange(id: string): Promise<ProfileChangeRow | null> {
    const row = await this.prisma.profileChangeRequest.findUnique({ where: { id } });
    return row ? { id: row.id, status: row.status } : null;
  }

  override async applyProfileDecision(input: {
    id: string;
    approved: boolean;
  }): Promise<ProfileChangeRow | null> {
    return this.prisma.$transaction(async (tx) => {
      const pending = await tx.profileChangeRequest.findFirst({
        where: { id: input.id, status: 'pending' },
      });
      if (!pending) {
        return null;
      }
      if (input.approved && pending.kind === 'name' && pending.firstName && pending.lastName) {
        await tx.profile.update({
          where: { userId: pending.userId },
          data: { firstName: pending.firstName, lastName: pending.lastName },
        });
      }
      if (input.approved && pending.kind === 'birth_year' && pending.birthYear !== null) {
        await tx.profile.update({
          where: { userId: pending.userId },
          data: { birthYear: pending.birthYear },
        });
      }
      const row = await tx.profileChangeRequest.update({
        where: { id: pending.id },
        data: { status: input.approved ? 'approved' : 'rejected' },
      });
      return { id: row.id, status: row.status };
    });
  }

  override async markPhoneVerified(userId: string, verifiedAt: Date): Promise<void> {
    await this.prisma.profile.update({
      where: { userId },
      data: { phoneVerifiedAt: verifiedAt },
    });
  }

  private client(context?: TransactionContext): DatabaseClient {
    return (context as Prisma.TransactionClient | undefined) ?? this.prisma;
  }
}
