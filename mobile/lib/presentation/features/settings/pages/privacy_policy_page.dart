import 'package:flutter/material.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';

class PrivacyPolicyPage extends StatelessWidget {
  const PrivacyPolicyPage({super.key});

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final List<String> sections = <String>[
      l10n.privacyUpdated,
      l10n.privacyWho,
      l10n.privacyCollected,
      l10n.privacyStorage,
      l10n.privacyServices,
      l10n.privacyRights,
    ];
    return AppScaffold(
      title: l10n.privacyPolicy,
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: sections.length,
        separatorBuilder: (BuildContext context, int index) =>
            const SizedBox(height: 16),
        itemBuilder: (BuildContext context, int index) {
          return Text(sections[index], key: Key('privacy-section-$index'));
        },
      ),
    );
  }
}
