import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_claim_repository.dart';
import 'package:dalil_dimashq/domain/usecase/claim_place_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/claim_place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/claim_place_page.dart';

void main() {
  testWidgets('a DD- code links the place immediately', (
    WidgetTester tester,
  ) async {
    final _Claims claims = _Claims();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: ClaimPlacePage(
          placeId: 'p1',
          bloc: ClaimPlaceBloc(ClaimPlaceUseCase(claims)),
        ),
      ),
    );
    await tester.enterText(find.byKey(const Key('place-code')), 'nope');
    await tester.tap(find.byKey(const Key('claim-with-code')));
    await tester.pump();
    expect(claims.code, isNull);
    expect(find.byKey(const Key('invalid-code')), findsOneWidget);
    await tester.enterText(find.byKey(const Key('place-code')), 'DD-4412');
    await tester.tap(find.byKey(const Key('claim-with-code')));
    await tester.pump();
    expect(claims.code, 'DD-4412');
    expect(find.byKey(const Key('place-linked')), findsOneWidget);
  });
}

class _Claims implements PlaceClaimRepository {
  String? code;

  @override
  Future<Either<Failure, bool>> claimWithCode({
    required String placeId,
    required String code,
  }) async {
    this.code = code;
    return const Right<Failure, bool>(true);
  }
}
