import { IsEmail } from 'class-validator';

import { ValidationExceptions } from '@/common/exceptions/validation.exception';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';

class SampleRequest {
  @IsEmail()
  email!: string;
}

describe('InputValidationPipe', () => {
  const pipe = new InputValidationPipe();

  it('rejects an unexpected field and an invalid email', async () => {
    await expect(
      pipe.transform(
        { email: 'not-an-email', extra: true },
        { type: 'body', metatype: SampleRequest },
      ),
    ).rejects.toBeInstanceOf(ValidationExceptions);
  });

  it('returns the transformed object for a valid body', async () => {
    const actual = await pipe.transform(
      { email: 'person@example.com' },
      { type: 'body', metatype: SampleRequest },
    );
    expect(actual).toBeInstanceOf(SampleRequest);
    expect((actual as SampleRequest).email).toBe('person@example.com');
  });
});
