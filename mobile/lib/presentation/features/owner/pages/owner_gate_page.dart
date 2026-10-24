import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/my_places_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_inbox_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_place_search_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/premium_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_inbox_page.dart';
import 'package:dalil_dimashq/presentation/features/owner/widgets/my_places_view.dart';
import 'package:dalil_dimashq/presentation/features/owner/widgets/owner_place_search.dart';
import 'package:dalil_dimashq/presentation/features/owner/widgets/premium_status_view.dart';

class OwnerGatePage extends StatelessWidget {
  const OwnerGatePage({
    required this.hasSession,
    this.places,
    this.premium,
    this.search,
    this.inbox,
    this.onMissingPlace,
    this.now,
    super.key,
  });

  final bool hasSession;
  final MyPlacesBloc? places;
  final PremiumBloc? premium;
  final OwnerPlaceSearchBloc? search;
  final OwnerInboxBloc? inbox;
  final void Function(BuildContext context)? onMissingPlace;
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
          OwnerPlaceSearch(bloc: search, onMissingPlace: onMissingPlace),
          if (_inbox() != null)
            TextButton(
              key: const Key('open-owner-inbox'),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) =>
                        OwnerInboxPage(bloc: _inbox()),
                  ),
                );
              },
              child: Text(l10n.ownerInbox),
            ),
          Expanded(child: MyPlacesView(bloc: places)),
          PremiumStatusView(bloc: premium, now: now),
        ],
      ),
    );
  }

  OwnerInboxBloc? _inbox() {
    if (inbox != null) {
      return inbox;
    }
    if (!getIt.isRegistered<OwnerInboxBloc>()) {
      return null;
    }
    return getIt<OwnerInboxBloc>();
  }
}
