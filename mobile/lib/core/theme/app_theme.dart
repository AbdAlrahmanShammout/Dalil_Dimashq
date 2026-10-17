import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/theme/app_colors.dart';

abstract final class AppTheme {
  static ThemeData get dark {
    final ColorScheme colorScheme =
        ColorScheme.fromSeed(
          seedColor: AppColors.teal,
          brightness: Brightness.dark,
        ).copyWith(
          primary: AppColors.teal,
          secondary: AppColors.gold,
          surface: AppColors.charcoalRaised,
        );
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.charcoal,
      colorScheme: colorScheme,
    );
  }
}
