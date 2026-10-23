import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/legal_document.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/legal_repository.dart';
import 'package:dalil_dimashq/domain/usecase/accept_legal_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_pending_legal_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/legal/bloc/legal_bloc.dart';
import 'package:dalil_dimashq/presentation/features/legal/pages/legal_page.dart';

void main() {
  testWidgets('a pending document can be accepted', (WidgetTester tester) async {
    final _MemoryLegal repository = _MemoryLegal();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: LegalPage(
          bloc: LegalBloc(
            LoadPendingLegalUseCase(repository),
            AcceptLegalUseCase(repository),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Terms of use'), findsOneWidget);
    await tester.tap(find.text('Accept'));
    await tester.pump();
    expect(repository.acceptedId, 7);
    expect(find.text('There is no new version to accept'), findsOneWidget);
  });
}

class _MemoryLegal implements LegalRepository {
  int? acceptedId;
  List<LegalDocument> documents = const <LegalDocument>[
    LegalDocument(
      id: 7,
      kind: 'terms',
      bodyAr: 'شروط',
      bodyEn: 'Terms of use',
    ),
  ];

  @override
  Future<Either<Failure, List<LegalDocument>>> pending() async {
    return Right(documents);
  }

  @override
  Future<Either<Failure, void>> accept(int documentId) async {
    acceptedId = documentId;
    documents = const <LegalDocument>[];
    return const Right(null);
  }
}
