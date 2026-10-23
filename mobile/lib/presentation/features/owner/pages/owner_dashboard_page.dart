import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/immediate_fields_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_dashboard_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/immediate_fields_page.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';

class OwnerDashboardPage extends StatelessWidget {
  const OwnerDashboardPage({
    required this.placeId,
    required this.bloc,
    this.visitorBloc,
    this.links,
    super.key,
  });

  final String placeId;
  final OwnerDashboardBloc bloc;
  final PlaceBloc? visitorBloc;
  final PlaceLinks? links;

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
                AppButton(
                  key: const Key('view-as-visitor'),
                  label: l10n.viewAsVisitor,
                  onPressed: () => _openVisitor(context),
                ),
                AppButton(
                  key: const Key('edit-details'),
                  label: l10n.editDetails,
                  onPressed: () {
                    if (!getIt.isRegistered<ImmediateFieldsBloc>()) {
                      return;
                    }
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (BuildContext context) => ImmediateFieldsPage(
                          placeId: placeId,
                          bloc: getIt<ImmediateFieldsBloc>(),
                        ),
                      ),
                    );
                  },
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

  void _openVisitor(BuildContext context) {
    final PlaceBloc? visitor = visitorBloc ??
        (getIt.isRegistered<PlaceBloc>() ? getIt<PlaceBloc>() : null);
    final PlaceLinks? placeLinks = links ??
        (getIt.isRegistered<PlaceLinks>() ? getIt<PlaceLinks>() : null);
    if (visitor == null || placeLinks == null) {
      return;
    }
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (BuildContext context) => PlacePage(
          placeId: placeId,
          placeBloc: visitor,
          links: placeLinks,
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
