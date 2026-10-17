// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:dalil_dimashq/core/di/register_module.dart' as _i111;
import 'package:dalil_dimashq/core/storage/token_storage.dart' as _i944;
import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart'
    as _i807;
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart'
    as _i360;
import 'package:dalil_dimashq/data/repository/locale_repository_impl.dart'
    as _i289;
import 'package:dalil_dimashq/data/repository/place_repository_impl.dart'
    as _i401;
import 'package:dalil_dimashq/data/repository/session_repository_impl.dart'
    as _i88;
import 'package:dalil_dimashq/domain/repositories/locale_repository.dart'
    as _i149;
import 'package:dalil_dimashq/domain/repositories/place_repository.dart'
    as _i823;
import 'package:dalil_dimashq/domain/repositories/session_repository.dart'
    as _i366;
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart'
    as _i261;
import 'package:dalil_dimashq/domain/usecase/read_locale_use_case.dart'
    as _i1013;
import 'package:dalil_dimashq/domain/usecase/save_locale_use_case.dart'
    as _i399;
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart'
    as _i116;
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart'
    as _i805;
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart'
    as _i308;
import 'package:dio/dio.dart' as _i361;
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:shared_preferences/shared_preferences.dart' as _i460;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  Future<_i174.GetIt> init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) async {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final registerModule = _$RegisterModule();
    await gh.factoryAsync<_i460.SharedPreferences>(
      () => registerModule.preferences,
      preResolve: true,
    );
    gh.lazySingleton<_i149.LocaleRepository>(
      () => _i289.LocaleRepositoryImpl(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i944.TokenStorage>(
      () => _i944.TokenStorage(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i366.SessionRepository>(
      () => _i88.SessionRepositoryImpl(gh<_i944.TokenStorage>()),
    );
    gh.factory<_i261.HasSessionUseCase>(
      () => _i261.HasSessionUseCase(gh<_i366.SessionRepository>()),
    );
    gh.lazySingleton<_i361.Dio>(
      () => registerModule.dio(gh<_i944.TokenStorage>()),
    );
    gh.factory<_i1013.ReadLocaleUseCase>(
      () => _i1013.ReadLocaleUseCase(gh<_i149.LocaleRepository>()),
    );
    gh.factory<_i399.SaveLocaleUseCase>(
      () => _i399.SaveLocaleUseCase(gh<_i149.LocaleRepository>()),
    );
    gh.lazySingleton<_i807.DirectoryApiClient>(
      () => registerModule.directoryApiClient(gh<_i361.Dio>()),
    );
    gh.factory<_i308.LanguageBloc>(
      () => _i308.LanguageBloc(
        gh<_i1013.ReadLocaleUseCase>(),
        gh<_i399.SaveLocaleUseCase>(),
      ),
    );
    gh.lazySingleton<_i360.DirectoryRemoteDataSource>(
      () => _i360.DirectoryRemoteDataSource(gh<_i807.DirectoryApiClient>()),
    );
    gh.lazySingleton<_i823.PlaceRepository>(
      () => _i401.PlaceRepositoryImpl(gh<_i360.DirectoryRemoteDataSource>()),
    );
    gh.factory<_i116.SearchPlacesUseCase>(
      () => _i116.SearchPlacesUseCase(gh<_i823.PlaceRepository>()),
    );
    gh.factory<_i805.ExploreBloc>(
      () => _i805.ExploreBloc(gh<_i116.SearchPlacesUseCase>()),
    );
    return this;
  }
}

class _$RegisterModule extends _i111.RegisterModule {}
