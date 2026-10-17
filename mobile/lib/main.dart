import 'package:flutter/widgets.dart';
import 'package:dalil_dimashq/core/config/app_config.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/presentation/core/app/dalil_app.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await configureInjection(AppConfig.environment);
  runApp(const DalilApp());
}
