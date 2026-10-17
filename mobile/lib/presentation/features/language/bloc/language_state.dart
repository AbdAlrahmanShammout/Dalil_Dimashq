import 'package:flutter/material.dart';

class LanguageState {
  const LanguageState(this.locale);

  final Locale locale;

  bool get isArabic => locale.languageCode == 'ar';
}
