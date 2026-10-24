export enum Environment {
  Local = 'local',
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

export const DEVELOPMENT_LIKE_ENVIRONMENTS: readonly Environment[] = [
  Environment.Local,
  Environment.Development,
  Environment.Test,
];
