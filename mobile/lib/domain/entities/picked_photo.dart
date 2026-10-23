enum PhotoOrigin { camera, gallery }

class PickedPhoto {
  const PickedPhoto({
    required this.name,
    required this.bytes,
    required this.width,
    required this.height,
  });

  final String name;
  final List<int> bytes;
  final int width;
  final int height;
}
