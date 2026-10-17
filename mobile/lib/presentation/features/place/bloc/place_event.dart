abstract class PlaceEvent {
  const PlaceEvent();
}

class PlaceRequested extends PlaceEvent {
  const PlaceRequested(this.id);

  final String id;
}
