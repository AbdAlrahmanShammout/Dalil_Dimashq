import 'package:flutter/material.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/my_places_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/premium_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/widgets/my_places_view.dart';
import 'package:dalil_dimashq/presentation/features/owner/widgets/premium_status_view.dart';

class OwnerGatePage extends StatelessWidget {
  const OwnerGatePage({
    required this.hasSession,
    this.places,
    this.premium,
    this.now,
    super.key,
  });

  final bool hasSession;
  final MyPlacesBloc? places;
  final PremiumBloc? premium;
  final DateTime? now;

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
      body: Column(
        children: <Widget>[
          Expanded(child: MyPlacesView(bloc: places)),
          PremiumStatusView(bloc: premium, now: now),
        ],
      ),
    );
  }
}
