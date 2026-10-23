class ContactMessage {
  const ContactMessage({
    required this.name,
    required this.contact,
    required this.type,
    required this.message,
  });

  final String name;
  final String contact;
  final String type;
  final String message;

  static const int maxBytes = 16384;
  static const int maxPerHour = 5;
  static const int maxPerDay = 40;
  static const Duration damascusOffset = Duration(hours: 3);
  static const List<String> types = <String>[
    'general',
    'add_facility',
    'partnership',
    'other',
  ];

  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'name': name,
      'contact': contact,
      'type': type,
      'message': message,
      'website': '',
    };
  }
}
