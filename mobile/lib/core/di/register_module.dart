import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dalil_dimashq/core/config/app_config.dart';
import 'package:dalil_dimashq/core/network/dio_factory.dart';
import 'package:dalil_dimashq/core/storage/token_storage.dart';
import 'package:dalil_dimashq/data/datasource/remote/auth_api_client.dart';
import 'package:dalil_dimashq/data/datasource/remote/contact_api_client.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart';
import 'package:dalil_dimashq/data/datasource/remote/profile_api_client.dart';
import 'package:dalil_dimashq/data/datasource/remote/suggestion_api_client.dart';

@module
abstract class RegisterModule {
  @preResolve
  Future<SharedPreferences> get preferences => SharedPreferences.getInstance();

  @lazySingleton
  Dio dio(TokenStorage tokenStorage) => DioFactory.create(tokenStorage);

  @lazySingleton
  DirectoryApiClient directoryApiClient(Dio dio) => DirectoryApiClient(dio);

  @lazySingleton
  AuthApiClient authApiClient(Dio dio) => AuthApiClient(dio);

  @lazySingleton
  ProfileApiClient profileApiClient(Dio dio) => ProfileApiClient(dio);

  @lazySingleton
  SuggestionApiClient suggestionApiClient(Dio dio) => SuggestionApiClient(dio);

  @lazySingleton
  ContactApiClient contactApiClient() {
    return ContactApiClient(
      Dio(
        BaseOptions(
          baseUrl: 'https://dalil-dimashq.com',
          connectTimeout: AppConfig.timeout,
          receiveTimeout: AppConfig.timeout,
        ),
      ),
    );
  }
}
