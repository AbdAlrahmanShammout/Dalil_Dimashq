import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_section.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_event.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.settings,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: AppSection(
          title: l10n.language,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              AppButton(
                label: l10n.arabic,
                onPressed: () {
                  context.read<LanguageBloc>().add(
                    const LanguageSelected(arabicLanguageCode),
                  );
                },
              ),
              const SizedBox(height: 12),
              AppButton(
                label: l10n.english,
                onPressed: () {
                  context.read<LanguageBloc>().add(
                    const LanguageSelected(englishLanguageCode),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
