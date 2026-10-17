import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/network/place_photo_url.dart';
import 'package:dalil_dimashq/domain/entities/place_photo.dart';

class GalleryPage extends StatelessWidget {
  const GalleryPage({
    required this.photos,
    required this.initialIndex,
    super.key,
  });

  final List<PlacePhoto> photos;
  final int initialIndex;

  @override
  Widget build(BuildContext context) {
    final PlacePhoto photo = photos[initialIndex];
    final String? url = placePhotoUrl(photo.storagePath);
    return Scaffold(
      key: const Key('gallery-page'),
      appBar: AppBar(),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            Text(photo.storagePath),
            if (url != null)
              Image.network(url, key: Key('gallery-photo-${photo.id}'))
            else
              SizedBox(key: Key('gallery-photo-${photo.id}'), height: 240),
          ],
        ),
      ),
    );
  }
}
