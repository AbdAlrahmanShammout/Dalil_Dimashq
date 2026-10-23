import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_name_search_repository.dart';
import 'package:dalil_dimashq/domain/usecase/search_places_by_name_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_place_search_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_gate_page.dart';

void main() {
  test('owner name search uses ilike on both place names', () async {
    final _Names names = _Names();
    await SearchPlacesByNameUseCase(names)('مقهى');
    expect(
      names.filter,
      '(name_ar.ilike.*مقهى*,name_en.ilike.*مقهى*)',
    );
    expect(names.filter, isNot(contains('search_places')));
    await SearchPlacesByNameUseCase(names)('   ');
    expect(names.calls, 1);
  });

  testWidgets('an owner can search places by name', (WidgetTester tester) async {
    final _Names names = _Names();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: OwnerGatePage(
          hasSession: true,
          search: OwnerPlaceSearchBloc(SearchPlacesByNameUseCase(names)),
        ),
      ),
    );
    await tester.enterText(find.byKey(const Key('owner-name-search')), 'مقهى');
    await tester.tap(find.byKey(const Key('owner-name-submit')));
    await tester.pump();
    expect(find.text('مقهى الروضة'), findsOneWidget);
  });
}

class _Names implements PlaceNameSearchRepository {
  String? filter;
  int calls = 0;

  @override
  Future<Either<Failure, List<OwnedPlace>>> byName(String filter) async {
    calls += 1;
    this.filter = filter;
    return const Right<Failure, List<OwnedPlace>>(<OwnedPlace>[
      OwnedPlace(id: 'p9', nameAr: 'مقهى الروضة', type: 'cafe'),
    ]);
  }
}
