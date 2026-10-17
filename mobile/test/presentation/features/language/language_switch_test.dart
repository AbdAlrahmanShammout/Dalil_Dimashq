import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/repositories/locale_repository.dart';
import 'package:dalil_dimashq/domain/usecase/read_locale_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/save_locale_use_case.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_state.dart';
import '../../../support/fake_place_repository.dart';

void main() {
  testWidgets('language switch flips copy and text direction', (
    WidgetTester tester,
  ) async {
    final _MemoryLocaleRepository repository = _MemoryLocaleRepository();
    final LanguageBloc bloc = LanguageBloc(
      ReadLocaleUseCase(repository),
      SaveLocaleUseCase(repository),
    );
    await tester.pumpWidget(
      BlocProvider<LanguageBloc>.value(
        value: bloc,
        child: BlocBuilder<LanguageBloc, LanguageState>(
          builder: (BuildContext context, LanguageState state) {
            return DalilApp(
              locale: state.locale,
              exploreBloc: exploreBlocForTest(FakePlaceRepository()),
            );
          },
        ),
      ),
    );
    expect(find.text('استكشف'), findsWidgets);
    expect(
      Directionality.of(tester.element(find.text('استكشف').first)),
      TextDirection.rtl,
    );
    await tester.tap(find.text('حسابي'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('الإنجليزية'));
    await tester.pumpAndSettle();
    expect(find.text('Language'), findsOneWidget);
    expect(
      Directionality.of(tester.element(find.text('Language'))),
      TextDirection.ltr,
    );
    bloc.close();
  });
}

class _MemoryLocaleRepository implements LocaleRepository {
  String? code;

  @override
  String? readLanguageCode() => code;

  @override
  Future<void> saveLanguageCode(String code) async {
    this.code = code;
  }
}
