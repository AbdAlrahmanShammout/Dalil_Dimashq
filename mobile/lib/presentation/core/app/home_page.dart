import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_section.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_event.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    return Padding(
      padding: const EdgeInsets.all(16),
      child: AppSection(
        title: l10n.directorySection,
        child: AppButton(
          label: isArabic ? l10n.english : l10n.arabic,
          onPressed: () {
            context.read<LanguageBloc>().add(
              LanguageSelected(
                isArabic ? englishLanguageCode : arabicLanguageCode,
              ),
            );
          },
        ),
      ),
    );
  }
}
