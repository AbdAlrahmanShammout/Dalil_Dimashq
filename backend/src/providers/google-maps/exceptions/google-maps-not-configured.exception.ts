import { DependencyFailureException } from '@/common/exceptions/dependency-failure.exception';

export class GoogleMapsNotConfiguredException extends DependencyFailureException {
  constructor() {
    super({
      message: 'Maps are not configured',
      code: 'dependency_failure',
    });
  }
}
