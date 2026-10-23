import 'package:dalil_dimashq/domain/entities/legal_document.dart';

class LegalState {
  const LegalState({
    this.documents = const <LegalDocument>[],
    this.isLoading = false,
    this.errorCode,
  });

  final List<LegalDocument> documents;
  final bool isLoading;
  final String? errorCode;

  LegalState copyWith({
    List<LegalDocument>? documents,
    bool? isLoading,
    String? errorCode,
    bool clearError = false,
  }) {
    return LegalState(
      documents: documents ?? this.documents,
      isLoading: isLoading ?? this.isLoading,
      errorCode: clearError ? null : errorCode ?? this.errorCode,
    );
  }
}
