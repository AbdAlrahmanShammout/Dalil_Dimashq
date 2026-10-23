import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_change_requests_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/my_requests_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/my_requests_page.dart';

void main() {
  testWidgets('requests show pending, accepted, rejected, and the note', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(800, 2000);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: MyRequestsPage(
          placeId: 'p1',
          bloc: MyRequestsBloc(ListChangeRequestsUseCase(_Requests())),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Pending'), findsOneWidget);
    expect(find.text('Accepted'), findsOneWidget);
    expect(find.text('Rejected'), findsOneWidget);
    expect(find.text('Name needs a document'), findsOneWidget);
  });
}

class _Requests implements ChangeRequestRepository {
  @override
  Future<Either<Failure, List<PlaceChangeRequest>>> list(String placeId) async {
    return const Right<Failure, List<PlaceChangeRequest>>(<PlaceChangeRequest>[
      PlaceChangeRequest(id: 1, kind: 'claim', status: 'pending'),
      PlaceChangeRequest(
        id: 2,
        kind: 'edit',
        status: 'approved',
        decisionNote: 'Name needs a document',
      ),
      PlaceChangeRequest(id: 3, kind: 'remove', status: 'rejected'),
    ]);
  }

  @override
  Future<Either<Failure, void>> submit({
    required String placeId,
    required String kind,
    required Map<String, dynamic> changes,
    String? message,
  }) async {
    return const Right<Failure, void>(null);
  }
}
