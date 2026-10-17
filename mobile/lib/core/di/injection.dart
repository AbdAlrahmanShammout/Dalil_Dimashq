import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/core/di/injection.config.dart';

final GetIt getIt = GetIt.instance;

@InjectableInit()
Future<void> configureInjection(String environment) async {
  await getIt.init(environment: environment);
}
