import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_place_repository.dart';
import 'package:dalil_dimashq/domain/usecase/list_owned_places_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/my_places_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_gate_page.dart';

void main() {
  testWidgets('my places shows the linked name, type, and address', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: OwnerGatePage(
          hasSession: true,
          places: MyPlacesBloc(ListOwnedPlacesUseCase(_Places())),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('المقهى'), findsOneWidget);
    expect(find.text('cafe · المزة'), findsOneWidget);
  });
}

class _Places implements OwnerPlaceRepository {
  @override
  Future<Either<Failure, List<OwnedPlace>>> list() async {
    return const Right<Failure, List<OwnedPlace>>(<OwnedPlace>[
      OwnedPlace(
        id: 'p1',
        nameAr: 'المقهى',
        type: 'cafe',
        address: 'المزة',
      ),
    ]);
  }
}
