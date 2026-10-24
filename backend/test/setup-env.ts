process.env.APP_ENV ??= 'test';
process.env.DATABASE_URL ??= `postgresql://${process.env.USER}@localhost:5432/dalil_dimashq_test`;
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret-value';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-value';
process.env.SWAGGER_ENABLED ??= 'false';
process.env.CORS_ORIGINS ??= 'http://localhost:3000';
