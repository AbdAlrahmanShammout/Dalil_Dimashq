import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/network/place_photo_url.dart';
import 'package:dalil_dimashq/domain/entities/place_photo.dart';

class GalleryPage extends StatefulWidget {
  const GalleryPage({
    required this.photos,
    required this.initialIndex,
    super.key,
  });

  final List<PlacePhoto> photos;
  final int initialIndex;

  @override
  State<GalleryPage> createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  late final PageController _controller = PageController(
    initialPage: widget.initialIndex,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: const Key('gallery-page'),
      appBar: AppBar(),
      body: PageView.builder(
        controller: _controller,
        itemCount: widget.photos.length,
        itemBuilder: (BuildContext context, int index) {
          final PlacePhoto photo = widget.photos[index];
          final String? url = placePhotoUrl(photo.storagePath);
          return InteractiveViewer(
            key: Key('gallery-zoom-${photo.id}'),
            panEnabled: false,
            minScale: 1,
            maxScale: 4,
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  Text(photo.storagePath),
                  if (url != null)
                    Image.network(url, key: Key('gallery-photo-${photo.id}'))
                  else
                    SizedBox(
                      key: Key('gallery-photo-${photo.id}'),
                      height: 240,
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
