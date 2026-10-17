import 'package:flutter/material.dart';

class AppScaffold extends StatelessWidget {
  const AppScaffold({
    required this.title,
    required this.body,
    this.action,
    this.bottomNavigationBar,
    super.key,
  });

  final String title;
  final Widget body;
  final Widget? action;
  final Widget? bottomNavigationBar;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title), actions: [?action]),
      body: body,
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}
