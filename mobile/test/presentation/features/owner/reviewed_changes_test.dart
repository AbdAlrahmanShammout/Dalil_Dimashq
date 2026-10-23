import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:dalil_dimashq/domain/usecase/submit_reviewed_changes_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/reviewed_changes_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/reviewed_changes_page.dart';

void main() {
  testWidgets('name, type, address, and class are sent for review', (
    WidgetTester tester,
  ) async {
    final _Requests requests = _Requests();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: ReviewedChangesPage(
          placeId: 'p1',
          bloc: ReviewedChangesBloc(SubmitReviewedChangesUseCase(requests)),
        ),
      ),
    );
    await tester.enterText(find.byKey(const Key('review-name-ar')), 'المقهى');
    await tester.enterText(find.byKey(const Key('review-type')), 'cafe');
    await tester.enterText(find.byKey(const Key('review-address')), 'المزة');
    await tester.enterText(find.byKey(const Key('review-class')), '4');
    await tester.tap(find.byKey(const Key('send-reviewed')));
    await tester.pump();
    expect(requests.kind, 'edit');
    expect(requests.changes?['name_ar'], 'المقهى');
    expect(requests.changes?['type'], 'cafe');
    expect(requests.changes?['address'], 'المزة');
    expect(requests.changes?['tourism_class'], 4);
    expect(find.byKey(const Key('changes-sent')), findsOneWidget);
  });
}

class _Requests implements ChangeRequestRepository {
  String? kind;
  Map<String, dynamic>? changes;

  @override
  Future<Either<Failure, List<PlaceChangeRequest>>> list(String placeId) async {
    return const Right<Failure, List<PlaceChangeRequest>>(
      <PlaceChangeRequest>[],
    );
  }

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
