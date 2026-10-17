String categoryFallbackAsset(String type) {
  switch (type) {
    case 'cafe':
      return 'assets/fallbacks/cafe.png';
    case 'hotel':
    case 'guest_house':
    case 'hostel':
    case 'motel':
      return 'assets/fallbacks/hotel.png';
    default:
      return 'assets/fallbacks/restaurant.png';
  }
}
