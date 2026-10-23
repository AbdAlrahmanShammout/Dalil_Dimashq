import 'package:dalil_dimashq/domain/entities/legal_document.dart';

class LegalDocumentDto {
  const LegalDocumentDto({
    required this.id,
    required this.kind,
    required this.bodyAr,
    required this.bodyEn,
  });

  final int id;
  final String kind;
  final String bodyAr;
  final String bodyEn;

  factory LegalDocumentDto.fromJson(Map<String, dynamic> json) {
    return LegalDocumentDto(
      id: (json['id'] as num).toInt(),
      kind: json['kind'] as String? ?? '',
      bodyAr: json['body_ar'] as String? ?? '',
      bodyEn: json['body_en'] as String? ?? '',
    );
  }

  LegalDocument toEntity() {
    return LegalDocument(id: id, kind: kind, bodyAr: bodyAr, bodyEn: bodyEn);
  }
}
