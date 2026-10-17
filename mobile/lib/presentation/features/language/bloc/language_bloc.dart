import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/usecase/read_locale_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/save_locale_use_case.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_event.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_state.dart';

const String arabicLanguageCode = 'ar';
const String englishLanguageCode = 'en';

@injectable
class LanguageBloc extends Bloc<LanguageEvent, LanguageState> {
  LanguageBloc(this._readLocale, this._saveLocale)
    : super(const LanguageState(Locale(arabicLanguageCode))) {
    on<LanguageStarted>(_onStarted);
    on<LanguageSelected>(_onSelected);
  }

  final ReadLocaleUseCase _readLocale;
  final SaveLocaleUseCase _saveLocale;

  void _onStarted(LanguageStarted event, Emitter<LanguageState> emit) {
    final String? code = _readLocale();
    emit(LanguageState(Locale(_supportedCode(code))));
  }

  Future<void> _onSelected(
    LanguageSelected event,
    Emitter<LanguageState> emit,
  ) async {
    final String code = _supportedCode(event.languageCode);
    await _saveLocale(code);
    emit(LanguageState(Locale(code)));
  }

  String _supportedCode(String? code) {
    if (code == englishLanguageCode) {
      return englishLanguageCode;
    }
    return arabicLanguageCode;
  }
}
