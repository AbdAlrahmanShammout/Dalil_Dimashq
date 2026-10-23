String placeNameFilter(String name) {
  final String term = name.replaceAll(RegExp(r'[,()*]'), '').trim();
  return '(name_ar.ilike.*$term*,name_en.ilike.*$term*)';
}
