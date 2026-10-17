import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/repositories/locale_repository.dart';
import 'package:dalil_dimashq/domain/usecase/read_locale_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/save_locale_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_state.dart';
import 'package:dalil_dimashq/presentation/features/settings/pages/settings_page.dart';

void main() {
  testWidgets('the settings language choice persists', (
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
            return MaterialApp(
              locale: state.locale,
              localizationsDelegates: AppLocalizations.localizationsDelegates,
              supportedLocales: AppLocalizations.supportedLocales,
              home: const SettingsPage(),
            );
          },
        ),
      ),
    );
    await tester.tap(find.widgetWithText(FilledButton, 'الإنجليزية'));
    await tester.pump();
    expect(repository.code, 'en');
    expect(
      Directionality.of(tester.element(find.text('Settings'))),
      TextDirection.ltr,
    );
  });
}

class _MemoryLocaleRepository implements LocaleRepository {
  String? code;

  @override
  String? readLanguageCode() => code;

  @override
  Future<void> saveLanguageCode(String value) async {
    code = value;
  }
}
