import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:dalil_dimashq/domain/repositories/place_claim_repository.dart';
import 'package:dalil_dimashq/domain/usecase/claim_place_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/submit_claim_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/claim_place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/submit_claim_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/claim_place_page.dart';

void main() {
  testWidgets('a claim without a code is sent for review', (
    WidgetTester tester,
  ) async {
    final _Requests requests = _Requests();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: ClaimPlacePage(
          placeId: 'p1',
          bloc: ClaimPlaceBloc(ClaimPlaceUseCase(_UnusedClaims())),
          submitClaim: SubmitClaimBloc(SubmitClaimUseCase(requests)),
        ),
      ),
    );
    await tester.tap(find.byKey(const Key('claim-without-code')));
    await tester.pump();
    expect(requests.kind, 'claim');
    expect(requests.changes, isEmpty);
    expect(find.byKey(const Key('claim-sent')), findsOneWidget);
  });
}

class _Requests implements ChangeRequestRepository {
  String? kind;
  Map<String, dynamic>? changes;

  @override
  Future<Either<Failure, void>> submit({
    required String placeId,
    required String kind,
    required Map<String, dynamic> changes,
    String? message,
  }) async {
    this.kind = kind;
    this.changes = changes;
    return const Right<Failure, void>(null);
  }
}

class _UnusedClaims implements PlaceClaimRepository {
  @override
  Future<Either<Failure, bool>> claimWithCode({
    required String placeId,
    required String code,
  }) async {
    return const Right<Failure, bool>(false);
  }
}
