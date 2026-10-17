import 'package:dalil_dimashq/domain/entities/place_enums.dart';

abstract class ExploreEvent {
  const ExploreEvent();
}

class ExploreStarted extends ExploreEvent {
  const ExploreStarted();
}

class ExploreQueryChanged extends ExploreEvent {
  const ExploreQueryChanged(this.query);

  final String query;
}

class ExploreCategorySelected extends ExploreEvent {
  const ExploreCategorySelected(this.category);

  final PlaceCategory category;
}
