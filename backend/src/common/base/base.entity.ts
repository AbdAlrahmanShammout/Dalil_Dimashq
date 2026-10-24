export class BaseEntity {
  id!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date | null;
}

type RelationValue<T> =
  NonNullable<T> extends Date ? T : NonNullable<T> extends object ? T | undefined : T;

/**
 * Makes loaded relations optional without making scalars or dates optional.
 */
export type OptionalRelations<T> = {
  [K in keyof T]: RelationValue<T[K]>;
};
