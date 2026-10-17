import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/theme/app_theme.dart';

class DalilApp extends StatelessWidget {
  const DalilApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dalil Dimashq',
      theme: AppTheme.dark,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.dark,
      home: const Scaffold(
        body: Center(child: Text('Dalil Dimashq')),
      ),
    );
  }
}
