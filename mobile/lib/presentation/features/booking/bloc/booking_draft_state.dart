class BookingDraftState {
  const BookingDraftState({
    this.displayName = '',
    this.phone = '',
    this.placeId,
  });

  final String displayName;
  final String phone;
  final String? placeId;
}
