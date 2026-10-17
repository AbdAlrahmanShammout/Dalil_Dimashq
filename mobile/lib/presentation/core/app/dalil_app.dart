import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/theme/app_theme.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_section.dart';

class DalilApp extends StatelessWidget {
  const DalilApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dalil Dimashq',
      theme: AppTheme.dark,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.dark,
      home: AppScaffold(
        title: 'Dalil Dimashq',
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: AppSection(
            title: 'Directory',
            child: AppButton(label: 'Explore', onPressed: () {}),
          ),
        ),
      ),
    );
  }
}
