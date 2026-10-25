import { Injectable, Optional } from '@nestjs/common';
import { AuditLogService, writeStaffAudit } from '@/modules/audit-log/audit-log.service';

import { InvalidStateException } from '@/common/exceptions/invalid-state.exception';
import { ResourceNotFoundException } from '@/common/exceptions/resource-not-found.exception';
import {
  ApprovedChangeEffect,
  ApprovedHourPeriod,
  ApprovedPlaceFields,
  PlaceChangeRecord,
  PlaceChangeRepository,
} from '@/modules/change-request/repository/place-change.repository';
import { PlaceType } from '@/modules/place/enum/general.enum';
import { assertValidWeek } from '@/modules/place-hour/place-hour.service';
import { PlaceService } from '@/modules/place/place.service';

export interface ReportPlaceInput {
  readonly userId: string;
  readonly placeId: string;
  readonly reason: string;
}

@Injectable()
export class PlaceChangeService {
  constructor(
    private readonly placeChangeRepository: PlaceChangeRepository,
    private readonly placeService: PlaceService,
    @Optional() private readonly auditLogService?: AuditLogService,
  ) {}

  /**
   * Opens a report. An empty reason is refused and nothing is stored.
   */
  async reportPlace(input: ReportPlaceInput): Promise<PlaceChangeRecord> {
    await this.placeService.getPublicPlace(input.placeId);
    const reason = input.reason.trim();
    if (!reason) {
      throw new InvalidStateException({ message: 'Reason is required', code: 'reason' });
    }
    return this.placeChangeRepository.create({
      placeId: input.placeId,
      userId: input.userId,
      kind: 'report',
      reason,
      payload: null,
    });
  }

  /**
   * Opens a claim with an empty change set. The place is not linked yet.
   */
  async openClaim(input: {
    readonly userId: string;
    readonly placeId: string;
  }): Promise<PlaceChangeRecord> {
    await this.placeService.getPublicPlace(input.placeId);
    return this.placeChangeRepository.create({
      placeId: input.placeId,
      userId: input.userId,
      kind: 'claim',
      reason: null,
      payload: null,
    });
  }

  /**
   * Stores an edit for review. The live place is left unchanged.
   */
  async openEdit(input: {
    readonly userId: string;
    readonly placeId: string;
    readonly payload: Record<string, unknown>;
  }): Promise<PlaceChangeRecord> {
    if (Object.keys(input.payload).length === 0) {
      throw new InvalidStateException({ message: 'Nothing to change', code: 'nothing_to_change' });
    }
    return this.placeChangeRepository.create({
      placeId: input.placeId,
      userId: input.userId,
      kind: 'edit',
      reason: null,
      payload: input.payload,
    });
  }

  /**
   * Asks staff to remove or unlink the place. The live row stays.
   */
  async openClosure(input: {
    readonly userId: string;
    readonly placeId: string;
    readonly kind: 'remove' | 'unlink';
    readonly reason: string;
  }): Promise<PlaceChangeRecord> {
    await this.placeService.getPublicPlace(input.placeId);
    const reason = input.reason.trim();
    if (!reason) {
      throw new InvalidStateException({ message: 'Reason is required', code: 'reason' });
    }
    return this.placeChangeRepository.create({
      placeId: input.placeId,
      userId: input.userId,
      kind: input.kind,
      reason,
      payload: null,
    });
  }

  /**
   * Pending, approved, and rejected requests. Approved is also labeled accepted for the client.
   */
  async listForPlace(placeId: string): Promise<PlaceChangeRecord[]> {
    return this.placeChangeRepository.listByPlace(placeId);
  }

  /**
   * Approves or rejects a pending request. Approval writes the stored change.
   */
  async decide(input: {
    readonly id: string;
    readonly decision: 'approved' | 'rejected';
    readonly note: string;
    readonly actorId?: string;
  }): Promise<PlaceChangeRecord> {
    const note = input.note.trim();
    if (!note) {
      throw new InvalidStateException({ message: 'Reason is required', code: 'reason' });
    }
    const pending = await this.placeChangeRepository.findById(input.id);
    if (!pending) {
      throw new ResourceNotFoundException('PlaceChangeRequest', input.id);
    }
    if (pending.status !== 'pending') {
      throw new InvalidStateException({ message: 'Already decided', code: 'invalid_state' });
    }
    const approved = input.decision === 'approved';
    const saved = await this.placeChangeRepository.applyDecision({
      id: input.id,
      approved,
      note,
      effect: approved ? buildEffect(pending) : null,
    });
    if (!saved) {
      throw new InvalidStateException({ message: 'Already decided', code: 'invalid_state' });
    }
    await writeStaffAudit(this.auditLogService, {
      actorId: input.actorId,
      action: 'change_request_decided',
      targetType: 'place_change_request',
      targetId: saved.id,
      note: saved.status,
    });
    return saved;
  }
}

const PLACE_TYPES: readonly string[] = Object.values(PlaceType);
const TEXT_FIELDS = ['nameAr', 'nameEn', 'addressAr', 'addressEn'] as const;

function buildEffect(pending: {
  kind: ApprovedChangeEffect['kind'];
  placeId: string;
  userId: string;
  payload: Record<string, unknown> | null;
}): ApprovedChangeEffect {
  return {
    kind: pending.kind,
    placeId: pending.placeId,
    userId: pending.userId,
    fields: pending.kind === 'edit' ? readFields(pending.payload) : {},
    hours: pending.kind === 'edit' ? readHours(pending.payload) : null,
  };
}

function readFields(payload: Record<string, unknown> | null): ApprovedPlaceFields {
  if (!payload) {
    return {};
  }
  const fields: {
    nameAr?: string;
    nameEn?: string;
    type?: string;
    addressAr?: string | null;
    addressEn?: string | null;
  } = {};
  for (const key of TEXT_FIELDS) {
    if (payload[key] === undefined) {
      continue;
    }
    const value = payload[key];
    if (typeof value !== 'string' && value !== null) {
      throw new InvalidStateException({ message: 'Nothing to change', code: 'nothing_to_change' });
    }
    if ((key === 'nameAr' || key === 'nameEn') && typeof value !== 'string') {
      throw new InvalidStateException({ message: 'Nothing to change', code: 'nothing_to_change' });
    }
    if (key === 'nameAr' || key === 'nameEn') {
      fields[key] = value as string;
      continue;
    }
    fields[key] = value;
  }
  if (payload.type !== undefined) {
    if (typeof payload.type !== 'string' || !PLACE_TYPES.includes(payload.type)) {
      throw new InvalidStateException({ message: 'Kind is invalid', code: 'kind_invalid' });
    }
    fields.type = payload.type;
  }
  return fields;
}

function readHours(payload: Record<string, unknown> | null): ApprovedHourPeriod[] | null {
  if (!payload || payload.hours === undefined) {
    return null;
  }
  if (!Array.isArray(payload.hours)) {
    throw new InvalidStateException({ message: 'Hours are invalid', code: 'hours_invalid' });
  }
  return assertValidWeek(
    payload.hours as Array<{
      dayOfWeek: number;
      periods: Array<{ opensAt: number; closesAt: number }>;
    }>,
  );
}
