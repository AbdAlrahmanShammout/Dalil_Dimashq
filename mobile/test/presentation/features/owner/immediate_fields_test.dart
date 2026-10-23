import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_immediate_fields.dart';
import 'package:dalil_dimashq/domain/entities/premium_status.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/place_edit_repository.dart';
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart';
import 'package:dalil_dimashq/domain/usecase/save_immediate_fields_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/immediate_fields_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/immediate_fields_page.dart';

void main() {
  testWidgets('a Premium owner saves phones and descriptions immediately', (
    WidgetTester tester,
  ) async {
    final _Edits edits = _Edits();
    await tester.pumpWidget(_page(edits, isActive: true));
    await tester.enterText(find.byKey(const Key('field-phones')), '011, 022');
    await tester.enterText(
      find.byKey(const Key('field-description-ar')),
      'وصف',
    );
    await tester.tap(find.byKey(const Key('save-immediate')));
    await tester.pump();
    expect(edits.body?.keys, isNot(contains('name_ar')));
    expect(edits.body?['phones'], <String>['011', '022']);
    expect(edits.body?['description_ar'], 'وصف');
    expect(find.byKey(const Key('details-saved')), findsOneWidget);
  });

  testWidgets('another owner is told Premium is required', (
    WidgetTester tester,
  ) async {
    final _Edits edits = _Edits();
    await tester.pumpWidget(_page(edits, isActive: false));
    await tester.tap(find.byKey(const Key('save-immediate')));
    await tester.pump();
    expect(edits.body, isNull);
    expect(find.byKey(const Key('premium-required')), findsOneWidget);
  });
}

Widget _page(_Edits edits, {required bool isActive}) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: ImmediateFieldsPage(
      placeId: 'p1',
      bloc: ImmediateFieldsBloc(
        SaveImmediateFieldsUseCase(edits, _Premium(isActive)),
      ),
    ),
  );
}

class _Premium implements PremiumRepository {
  const _Premium(this.isActive);

  final bool isActive;

  @override
  Future<Either<Failure, PremiumStatus>> load(DateTime now) async {
    return Right<Failure, PremiumStatus>(
      PremiumStatus(
        isActive: isActive,
        pendingRequests: 0,
        endsAt: isActive ? DateTime.utc(2026, 12, 1) : null,
      ),
    );
  }
}

class _Edits implements PlaceEditRepository {
  Map<String, dynamic>? body;

  @override
  Future<Either<Failure, void>> saveImmediate({
    required String placeId,
    required PlaceImmediateFields fields,
  }) async {
    body = fields.toJson();
    return const Right<Failure, void>(null);
  }
}
