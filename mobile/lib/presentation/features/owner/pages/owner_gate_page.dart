import 'package:flutter/material.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';

class OwnerGatePage extends StatelessWidget {
  const OwnerGatePage({required this.hasSession, super.key});

  final bool hasSession;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    if (!hasSession) {
      return AppScaffold(
        title: l10n.owner,
        body: Center(child: Text(l10n.signInRequired)),
      );
    }
    return AppScaffold(
      title: l10n.owner,
      body: Center(child: Text(l10n.myPlaces)),
    );
  }
}
