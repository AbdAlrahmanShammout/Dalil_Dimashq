import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_photo.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/gallery_page.dart';

class PlacePhotosSection extends StatelessWidget {
  const PlacePhotosSection({required this.place, super.key});

  final PlaceDetail place;

  @override
  Widget build(BuildContext context) {
    if (place.photos.isEmpty) {
      return const SizedBox.shrink();
    }
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            AppLocalizations.of(context).photos,
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: <Widget>[
              for (var index = 0; index < place.photos.length; index++)
                _PhotoThumb(place: place, index: index),
            ],
          ),
        ],
      ),
    );
  }
}

class _PhotoThumb extends StatelessWidget {
  const _PhotoThumb({required this.place, required this.index});

  final PlaceDetail place;
  final int index;

  @override
  Widget build(BuildContext context) {
    final PlacePhoto photo = place.photos[index];
    return GestureDetector(
      key: Key('place-photo-${photo.id}'),
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute<void>(
            builder: (_) =>
                GalleryPage(photos: place.photos, initialIndex: index),
          ),
        );
      },
      child: const SizedBox(width: 72, height: 72, child: Icon(Icons.image)),
    );
  }
}
