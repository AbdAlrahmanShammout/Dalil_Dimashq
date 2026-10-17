import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/theme/app_colors.dart';

class AppSection extends StatelessWidget {
  const AppSection({required this.title, required this.child, super.key});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          title,
          style: Theme.of(
            context,
          ).textTheme.titleMedium?.copyWith(color: AppColors.gold),
        ),
        const SizedBox(height: 12),
        child,
      ],
    );
  }
}
