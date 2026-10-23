import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_section.dart';
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_event.dart';
import 'package:dalil_dimashq/presentation/features/legal/pages/legal_page.dart';
import 'package:dalil_dimashq/presentation/features/settings/pages/privacy_policy_page.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/notifications_toggle.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/site_contact_shortcuts.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({this.notifications, super.key});

  final NotificationPreferenceRepository? notifications;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.settings,
      body: SingleChildScrollView(
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
              NotificationsToggle(repository: notifications),
              SiteContactShortcuts(),
              const SizedBox(height: 12),
              AppButton(
                label: l10n.termsAndPrivacy,
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (BuildContext context) => const LegalPage(),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),
              AppButton(
                label: l10n.privacyPolicy,
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (BuildContext context) =>
                          const PrivacyPolicyPage(),
                    ),
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
