import 'package:dalil_dimashq/domain/entities/site_contact.dart';

class SiteContactDto {
  const SiteContactDto({required this.key, required this.value});

  final String key;
  final String value;

  factory SiteContactDto.fromJson(Map<String, dynamic> json) {
    return SiteContactDto(
      key: json['key'] as String? ?? '',
      value: json['value'] as String? ?? '',
    );
  }

  SiteContact toEntity() {
    return SiteContact(key: key, value: value);
  }
}
