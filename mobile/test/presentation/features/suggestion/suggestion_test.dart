import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/suggestion.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/suggestion_repository.dart';
import 'package:dalil_dimashq/domain/usecase/submit_suggestion_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/suggestion/bloc/suggestion_bloc.dart';
import 'package:dalil_dimashq/presentation/features/suggestion/pages/suggestion_page.dart';

void main() {
  testWidgets('the suggestion form waits for confirmed kinds', (
    WidgetTester tester,
  ) async {
    final _RecordingSuggestions repository = _RecordingSuggestions();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: SuggestionPage(
          bloc: SuggestionBloc(SubmitSuggestionUseCase(repository)),
        ),
      ),
    );
    await tester.enterText(find.byKey(const Key('suggestion-name')), 'Rami');
    await tester.enterText(
      find.byKey(const Key('suggestion-contact')),
      '0912345678',
    );
    await tester.enterText(find.byKey(const Key('suggestion-place')), 'p1');
    await tester.enterText(
      find.byKey(const Key('suggestion-message')),
      'Add a missing cafe',
    );
    await tester.tap(find.text('Send'));
    await tester.pump();
    expect(find.text('Suggestion types are not confirmed yet'), findsOneWidget);
    expect(repository.calls, 0);
  });

  test('submit does not call the server while kinds are missing', () async {
    final _RecordingSuggestions repository = _RecordingSuggestions();
    final SubmitSuggestionUseCase useCase = SubmitSuggestionUseCase(
      repository,
    );
    final Either<Failure, void> result = await useCase(
      const Suggestion(name: 'Rami', contact: '1', message: 'hello'),
    );
    expect(
      result.fold((Failure failure) => failure.message, (_) => ''),
      'suggestion_kind_pending',
    );
    expect(repository.calls, 0);
  });
}

class _RecordingSuggestions implements SuggestionRepository {
  int calls = 0;

  @override
  Future<Either<Failure, void>> send(
    Suggestion suggestion,
    String kind,
  ) async {
    calls += 1;
    return const Right<Failure, void>(null);
  }
}
