import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_dashboard_repository.dart';
import 'package:dalil_dimashq/domain/usecase/load_owner_dashboard_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_dashboard_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_dashboard_page.dart';

void main() {
  testWidgets('the dashboard shows the place summary and sections', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: OwnerDashboardPage(
          placeId: 'p1',
          bloc: OwnerDashboardBloc(LoadOwnerDashboardUseCase(_Dashboard())),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('المقهى'), findsOneWidget);
    expect(find.text('cafe · المزة'), findsOneWidget);
    expect(find.text('Hours'), findsOneWidget);
    expect(find.text('Booking settings'), findsOneWidget);
  });
}

class _Dashboard implements OwnerDashboardRepository {
  @override
  Future<Either<Failure, OwnerDashboard>> load(String placeId) async {
    return const Right<Failure, OwnerDashboard>(
      OwnerDashboard(
        place: OwnedPlace(
          id: 'p1',
          nameAr: 'المقهى',
          type: 'cafe',
          address: 'المزة',
        ),
      ),
    );
  }
}
