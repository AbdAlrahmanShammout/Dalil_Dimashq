import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/config/app_config.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_event.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_state.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await configureInjection(AppConfig.environment);
  final LanguageBloc languageBloc = getIt<LanguageBloc>()
    ..add(const LanguageStarted());
  runApp(DalilRoot(languageBloc: languageBloc));
}

class DalilRoot extends StatelessWidget {
  const DalilRoot({required this.languageBloc, super.key});

  final LanguageBloc languageBloc;

  @override
  Widget build(BuildContext context) {
    return BlocProvider<LanguageBloc>.value(
      value: languageBloc,
      child: BlocBuilder<LanguageBloc, LanguageState>(
        builder: (BuildContext context, LanguageState state) {
          return DalilApp(locale: state.locale);
        },
      ),
    );
  }
}
