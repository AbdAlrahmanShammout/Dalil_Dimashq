import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/theme/app_theme.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/app/visitor_shell.dart';

class DalilApp extends StatelessWidget {
  const DalilApp({super.key, this.locale = const Locale('ar'), this.home});

  final Locale locale;
  final Widget? home;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      locale: locale,
      onGenerateTitle: (BuildContext context) =>
          AppLocalizations.of(context).appTitle,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      theme: AppTheme.dark,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.dark,
      home: home ?? const VisitorShell(),
    );
  }
}
