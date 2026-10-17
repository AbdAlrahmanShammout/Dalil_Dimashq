import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/offers/bloc/offers_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/place_page.dart';

class OffersPage extends StatelessWidget {
  const OffersPage({this.offersBloc, this.now, this.placeBuilder, super.key});

  final OffersBloc? offersBloc;
  final DateTime? now;
  final Widget Function(String placeId)? placeBuilder;

  @override
  Widget build(BuildContext context) {
    final OffersBloc bloc = offersBloc ?? getIt<OffersBloc>();
    final DateTime clock = now ?? DateTime.now();
    return BlocProvider<OffersBloc>.value(
      value: bloc..add(OffersStarted(clock)),
      child: _OffersView(placeBuilder: placeBuilder),
    );
  }
}

class _OffersView extends StatelessWidget {
  const _OffersView({required this.placeBuilder});

  final Widget Function(String placeId)? placeBuilder;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    return AppScaffold(
      title: l10n.offers,
      body: BlocBuilder<OffersBloc, OffersState>(
        builder: (BuildContext context, OffersState state) {
          return ListView(
            children: state.offers.map((PlaceOffer offer) {
              final String title = isArabic
                  ? offer.titleAr
                  : (offer.titleEn ?? offer.titleAr);
              return ListTile(
                key: Key('offer-${offer.id}'),
                title: Text(title),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) =>
                          placeBuilder?.call(offer.placeId) ??
                          PlacePage(placeId: offer.placeId),
                    ),
                  );
                },
              );
            }).toList(),
          );
        },
      ),
    );
  }
}

class OffersEntry extends StatelessWidget {
  const OffersEntry({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional.centerStart,
      child: TextButton(
        key: const Key('offers-entry'),
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const OffersPage(),
            ),
          );
        },
        child: Text(AppLocalizations.of(context).offers),
      ),
    );
  }
}
