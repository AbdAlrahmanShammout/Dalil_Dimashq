import 'package:dalil_dimashq/domain/entities/amenity.dart';

class OwnerAmenities {
  const OwnerAmenities({
    required this.catalog,
    required this.selected,
  });

  final List<Amenity> catalog;
  final List<String> selected;

  bool has(String code) => selected.contains(code);
}
