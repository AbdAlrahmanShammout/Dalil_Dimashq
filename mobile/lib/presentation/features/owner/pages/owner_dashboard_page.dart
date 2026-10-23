import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_dashboard_bloc.dart';

class OwnerDashboardPage extends StatelessWidget {
  const OwnerDashboardPage({
    required this.placeId,
    required this.bloc,
    super.key,
  });

  final String placeId;
  final OwnerDashboardBloc bloc;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<OwnerDashboardBloc>.value(
      value: bloc..add(OwnerDashboardStarted(placeId)),
      child: AppScaffold(
        title: l10n.owner,
        body: BlocBuilder<OwnerDashboardBloc, OwnerDashboardState>(
          builder: (BuildContext context, OwnerDashboardState state) {
            final dashboard = state.dashboard;
            if (dashboard == null) {
              return const SizedBox.shrink();
            }
            return ListView(
              children: <Widget>[
                ListTile(
                  key: const Key('dashboard-summary'),
                  title: Text(dashboard.place.nameAr),
                  subtitle: Text(
                    '${dashboard.place.type}${dashboard.place.address == null ? '' : ' · ${dashboard.place.address}'}',
                  ),
                ),
                ...OwnerDashboard.sections.map(
                  (String section) => ListTile(
                    key: Key('section-$section'),
                    title: Text(_label(l10n, section)),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  String _label(AppLocalizations l10n, String section) {
    switch (section) {
      case 'hours':
        return l10n.ownerHours;
      case 'amenities':
        return l10n.ownerAmenities;
      case 'photos':
        return l10n.ownerPhotos;
      case 'offers':
        return l10n.ownerOffers;
      case 'bookings':
        return l10n.ownerBookings;
      case 'requests':
        return l10n.ownerRequests;
      default:
        return l10n.ownerSettings;
    }
  }
}
