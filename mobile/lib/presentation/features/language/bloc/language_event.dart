abstract class LanguageEvent {
  const LanguageEvent();
}

class LanguageStarted extends LanguageEvent {
  const LanguageStarted();
}

class LanguageSelected extends LanguageEvent {
  const LanguageSelected(this.languageCode);

  final String languageCode;
}
