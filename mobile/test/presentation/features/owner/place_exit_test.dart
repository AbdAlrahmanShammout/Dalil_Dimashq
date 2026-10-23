import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:dalil_dimashq/domain/repositories/place_exit_repository.dart';
import 'package:dalil_dimashq/domain/usecase/request_place_exit_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/place_exit_page.dart';

void main() {
  testWidgets('removal and unlink both send a reason', (WidgetTester tester) async {
    final _Requests requests = _Requests();
    final _Exits exits = _Exits();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: PlaceExitPage(
          placeId: 'p1',
          exit: RequestPlaceExitUseCase(requests, exits),
        ),
      ),
    );
    await tester.tap(find.byKey(const Key('request-removal')));
    await tester.pump();
    expect(requests.kind, isNull);
    await tester.enterText(find.byKey(const Key('exit-reason')), 'أُغلق المحل');
    await tester.tap(find.byKey(const Key('request-removal')));
    await tester.pump();
    expect(requests.kind, 'remove');
    expect(requests.message, 'أُغلق المحل');
    await tester.tap(find.byKey(const Key('request-unlink')));
    await tester.pump();
    expect(exits.reason, 'أُغلق المحل');
    expect(find.byKey(const Key('exit-sent')), findsOneWidget);
  });
}

class _Requests implements ChangeRequestRepository {
  String? kind;
  String? message;

  @override
  Future<Either<Failure, List<PlaceChangeRequest>>> list(String placeId) async {
    return const Right<Failure, List<PlaceChangeRequest>>(<PlaceChangeRequest>[]);
  }

  @override
  Future<Either<Failure, void>> submit({
    required String placeId,
    required String kind,
    required Map<String, dynamic> changes,
    String? message,
  }) async {
    this.kind = kind;
    this.message = message;
    return const Right<Failure, void>(null);
  }
}

class _Exits implements PlaceExitRepository {
  String? reason;

  @override
  Future<Either<Failure, int>> unlink({
    required String placeId,
    required String reason,
  }) async {
    this.reason = reason;
    return const Right<Failure, int>(9);
  }
}
