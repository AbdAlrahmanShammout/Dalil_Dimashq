class OwnerBooking {
  const OwnerBooking({
    required this.id,
    required this.customerName,
    required this.customerPhone,
    required this.party,
    required this.at,
    required this.status,
    required this.reported,
    this.note,
  });

  final int id;
  final String customerName;
  final String customerPhone;
  final int party;
  final DateTime at;
  final String? note;
  final String status;
  final bool reported;
}
