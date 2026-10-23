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
  testWidgets('a missing place offers Contact us', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: OwnerGatePage(
          hasSession: true,
          search: OwnerPlaceSearchBloc(SearchPlacesByNameUseCase(_Empty())),
          onMissingPlace: (BuildContext context) {
            Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (BuildContext context) => const Scaffold(
                  body: Text('Contact us', key: Key('contact-opened')),
                ),
              ),
            );
          },
        ),
      ),
    );
    await tester.enterText(find.byKey(const Key('owner-name-search')), 'محل');
    await tester.tap(find.byKey(const Key('owner-name-submit')));
    await tester.pump();
    expect(find.byKey(const Key('missing-place')), findsOneWidget);
    await tester.tap(find.byKey(const Key('missing-place')));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('contact-opened')), findsOneWidget);
  });
}

class _Empty implements PlaceNameSearchRepository {
  @override
  Future<Either<Failure, List<OwnedPlace>>> byName(String filter) async {
    return const Right<Failure, List<OwnedPlace>>(<OwnedPlace>[]);
  }
}
