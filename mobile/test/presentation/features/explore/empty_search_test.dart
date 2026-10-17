import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('an empty search shows the empty state', (WidgetTester tester) async {
    await tester.pumpWidget(
      DalilApp(
        locale: const Locale('en'),
        exploreBloc: exploreBlocForTest(FakePlaceRepository()),
      ),
    );
    await tester.pump();
    expect(find.text('No matching places'), findsOneWidget);
  });
}
