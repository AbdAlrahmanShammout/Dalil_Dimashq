export interface ValidationErrorObject {
  readonly property: string;
  readonly constraints: Readonly<Record<string, string>>;
}

export interface ValidationExceptionInput {
  readonly message: string;
  readonly code?: string;
  readonly validationErrorObjects: readonly ValidationErrorObject[];
}
