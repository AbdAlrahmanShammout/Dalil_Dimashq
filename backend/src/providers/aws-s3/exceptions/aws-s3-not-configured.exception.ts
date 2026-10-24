import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';

export class AwsS3NotConfiguredException extends DependencyFailureException {
  constructor() {
    super({
      message: 'Object storage is not configured',
      code: 'dependency_failure',
    });
  }
}
