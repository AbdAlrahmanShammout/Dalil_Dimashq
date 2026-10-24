const DEFAULT_LANGUAGE = 'ar';
const ENGLISH_LANGUAGE = 'en';

interface RankedLanguage {
  readonly language: 'ar' | 'en';
  readonly quality: number;
}

function readQuality(parameters: readonly string[]): number {
  const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='));
  if (!qualityParameter) {
    return 1;
  }
  const quality = Number(qualityParameter.trim().slice(2));
  return Number.isFinite(quality) ? quality : 0;
}

export function resolveErrorLanguage(acceptLanguage: string | undefined): 'ar' | 'en' {
  const ranked = (acceptLanguage ?? '')
    .split(',')
    .map((part): RankedLanguage | null => {
      const [rawTag, ...parameters] = part.split(';');
      const tag = rawTag.trim().toLowerCase();
      const language = tag.startsWith(ENGLISH_LANGUAGE)
        ? ENGLISH_LANGUAGE
        : tag.startsWith(DEFAULT_LANGUAGE)
          ? DEFAULT_LANGUAGE
          : null;
      if (!language) {
        return null;
      }
      return { language, quality: readQuality(parameters) };
    })
    .filter((entry): entry is RankedLanguage => entry !== null)
    .sort((left, right) => right.quality - left.quality);
  return ranked[0]?.language ?? DEFAULT_LANGUAGE;
}
