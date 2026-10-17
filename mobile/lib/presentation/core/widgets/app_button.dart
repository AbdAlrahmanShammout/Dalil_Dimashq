import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/theme/app_colors.dart';

class AppButton extends StatelessWidget {
  const AppButton({required this.label, required this.onPressed, super.key});

  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: onPressed,
      style: FilledButton.styleFrom(
        backgroundColor: AppColors.teal,
        foregroundColor: AppColors.textPrimary,
      ),
      child: Text(label),
    );
  }
}
