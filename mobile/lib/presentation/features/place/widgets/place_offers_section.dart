import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:dalil_dimashq/core/network/place_photo_url.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_offer.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceOffersSection extends StatelessWidget {
  const PlaceOffersSection({required this.place, this.now, super.key});

  final PlaceDetail place;
  final DateTime? now;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    final List<PlaceOffer> offers = currentOffers(
      place.offers,
      now ?? DateTime.now(),
    );
    if (offers.isEmpty) {
      return const SizedBox.shrink();
    }
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(l10n.offers, style: Theme.of(context).textTheme.titleMedium),
          for (final PlaceOffer offer in offers)
            _OfferTile(offer: offer, isArabic: isArabic),
        ],
      ),
    );
  }
}

class _OfferTile extends StatelessWidget {
  const _OfferTile({required this.offer, required this.isArabic});

  final PlaceOffer offer;
  final bool isArabic;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final String title = isArabic
        ? offer.titleAr
        : (offer.titleEn ?? offer.titleAr);
    final String? details = isArabic ? offer.detailsAr : offer.detailsEn;
    final String? image = placePhotoUrl(offer.photoPath);
    final String? until = offer.endsAt == null
        ? null
        : l10n.untilDate(
            DateFormat.yMMMd(
              Localizations.localeOf(context).toString(),
            ).format(offer.endsAt!.toLocal()),
          );
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(title),
          if (details != null && details.isNotEmpty) Text(details),
          if (until != null) Text(until),
          if (image != null)
            Image.network(
              image,
              key: Key('place-offer-${offer.id}'),
              height: 120,
            )
          else if (offer.photoPath != null)
            SizedBox(key: Key('place-offer-${offer.id}'), height: 120),
        ],
      ),
    );
  }
}
