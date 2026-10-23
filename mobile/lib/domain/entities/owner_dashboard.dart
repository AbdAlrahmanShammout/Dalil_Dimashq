import 'package:dalil_dimashq/domain/entities/owned_place.dart';

class OwnerDashboard {
  const OwnerDashboard({required this.place});

  final OwnedPlace place;

  static const List<String> sections = <String>[
    'hours',
    'amenities',
    'photos',
    'offers',
    'bookings',
    'requests',
    'settings',
  ];
}
