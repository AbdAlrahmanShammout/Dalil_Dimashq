import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/owned_place.dart';
import 'package:dalil_dimashq/domain/entities/owner_dashboard.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/owner_dashboard_repository.dart';
import 'package:dalil_dimashq/domain/repositories/place_repository.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_owner_dashboard_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_dashboard_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_dashboard_page.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';

void main() {
  testWidgets('view as visitor opens the public place page', (
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
          visitorBloc: PlaceBloc(GetPlaceUseCase(_Places())),
          links: _Links(),
        ),
      ),
    );
    await tester.pump();
    await tester.tap(find.byKey(const Key('view-as-visitor')));
    await tester.pump();
    await tester.pump();
    expect(find.text('المقهى'), findsWidgets);
    expect(find.text('Dalil Dimashq'), findsOneWidget);
  });
}

class _Dashboard implements OwnerDashboardRepository {
  @override
  Future<Either<Failure, OwnerDashboard>> load(String placeId) async {
    return const Right<Failure, OwnerDashboard>(
      OwnerDashboard(
        place: OwnedPlace(id: 'p1', nameAr: 'المقهى', type: 'cafe'),
      ),
    );
  }
}

class _Places implements PlaceRepository {
  @override
  Future<Either<Failure, List<Area>>> areas() async {
    return const Right<Failure, List<Area>>(<Area>[]);
  }

  @override
  Future<Either<Failure, PlaceDetail>> getPlace(String id) async {
    return Right<Failure, PlaceDetail>(
      PlaceDetail(id: id, type: 'cafe', nameAr: 'المقهى'),
    );
  }

  @override
  Future<Either<Failure, PlaceSearchPage>> search(PlaceSearchQuery query) async {
    return const Right<Failure, PlaceSearchPage>(
      PlaceSearchPage(
        places: <PlaceSummary>[],
        total: 0,
        counts: PlaceCategoryCounts(all: 0, hotels: 0, restaurants: 0, cafes: 0),
      ),
    );
  }
}

class _Links implements PlaceLinks {
  @override
  Future<void> call(String phone) async {}

  @override
  Future<void> copyPhone(String phone) async {}

  @override
  Future<void> openDirections({
    required double latitude,
    required double longitude,
  }) async {}

  @override
  Future<void> openUrl(Uri uri) async {}

  @override
  Future<void> share(String text) async {}
}
