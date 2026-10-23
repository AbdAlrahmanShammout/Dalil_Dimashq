import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/premium_bloc.dart';

class PremiumStatusView extends StatelessWidget {
  const PremiumStatusView({this.bloc, this.now, super.key});

  final PremiumBloc? bloc;
  final DateTime? now;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<PremiumBloc>.value(
        value: bloc!
          ..add(PremiumStarted(now ?? DateTime.now())),
        child: const _PremiumBody(),
      );
    }
    if (!getIt.isRegistered<PremiumBloc>()) {
      return const SizedBox.shrink();
    }
    return BlocProvider<PremiumBloc>(
      create: (BuildContext context) => getIt<PremiumBloc>()
        ..add(PremiumStarted(now ?? DateTime.now())),
      child: const _PremiumBody(),
    );
  }
}

class _PremiumBody extends StatelessWidget {
  const _PremiumBody();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocBuilder<PremiumBloc, PremiumState>(
      builder: (BuildContext context, PremiumState state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            if (state.status.isActive)
              Text(
                l10n.premiumUntil(state.status.endDate),
                key: const Key('premium-until'),
              ),
            Text(
              l10n.pendingRequests(state.status.pendingRequests),
              key: const Key('pending-requests'),
            ),
          ],
        );
      },
    );
  }
}
