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
import 'package:dalil_dimashq/data/datasource/local/device_place_links.dart'
    as _i227;
import 'package:dalil_dimashq/data/datasource/local/geolocator_device_location.dart'
    as _i787;
import 'package:dalil_dimashq/data/datasource/remote/auth_api_client.dart'
    as _i371;
import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart'
    as _i807;
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart'
    as _i360;
import 'package:dalil_dimashq/data/datasource/remote/profile_api_client.dart'
    as _i413;
import 'package:dalil_dimashq/data/repository/auth_repository_impl.dart'
    as _i327;
import 'package:dalil_dimashq/data/repository/event_repository_impl.dart'
    as _i215;
import 'package:dalil_dimashq/data/repository/legal_repository_impl.dart'
    as _i126;
import 'package:dalil_dimashq/data/repository/locale_repository_impl.dart'
    as _i289;
import 'package:dalil_dimashq/data/repository/notification_preference_repository_impl.dart'
    as _i390;
import 'package:dalil_dimashq/data/repository/offer_repository_impl.dart'
    as _i908;
import 'package:dalil_dimashq/data/repository/place_repository_impl.dart'
    as _i401;
import 'package:dalil_dimashq/data/repository/profile_repository_impl.dart'
    as _i352;
import 'package:dalil_dimashq/data/repository/session_repository_impl.dart'
    as _i88;
import 'package:dalil_dimashq/data/repository/site_contact_repository_impl.dart'
    as _i31;
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart'
    as _i242;
import 'package:dalil_dimashq/domain/repositories/event_repository.dart'
    as _i203;
import 'package:dalil_dimashq/domain/repositories/legal_repository.dart'
    as _i218;
import 'package:dalil_dimashq/domain/repositories/locale_repository.dart'
    as _i149;
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart'
    as _i100;
import 'package:dalil_dimashq/domain/repositories/offer_repository.dart'
    as _i921;
import 'package:dalil_dimashq/domain/repositories/place_repository.dart'
    as _i823;
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart'
    as _i539;
import 'package:dalil_dimashq/domain/repositories/session_repository.dart'
    as _i366;
import 'package:dalil_dimashq/domain/repositories/site_contact_repository.dart'
    as _i1018;
import 'package:dalil_dimashq/domain/services/device_location.dart' as _i845;
import 'package:dalil_dimashq/domain/services/place_links.dart' as _i820;
import 'package:dalil_dimashq/domain/usecase/accept_legal_use_case.dart'
    as _i901;
import 'package:dalil_dimashq/domain/usecase/complete_profile_use_case.dart'
    as _i787;
import 'package:dalil_dimashq/domain/usecase/delete_account_use_case.dart'
    as _i867;
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart' as _i654;
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart'
    as _i261;
import 'package:dalil_dimashq/domain/usecase/list_areas_use_case.dart' as _i80;
import 'package:dalil_dimashq/domain/usecase/list_events_use_case.dart'
    as _i460;
import 'package:dalil_dimashq/domain/usecase/list_offers_use_case.dart'
    as _i1024;
import 'package:dalil_dimashq/domain/usecase/load_pending_legal_use_case.dart'
    as _i140;
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart'
    as _i525;
import 'package:dalil_dimashq/domain/usecase/load_site_contacts_use_case.dart'
    as _i430;
import 'package:dalil_dimashq/domain/usecase/read_locale_use_case.dart'
    as _i1013;
import 'package:dalil_dimashq/domain/usecase/recover_password_use_case.dart'
    as _i244;
import 'package:dalil_dimashq/domain/usecase/request_profile_change_use_case.dart'
    as _i578;
import 'package:dalil_dimashq/domain/usecase/save_locale_use_case.dart'
    as _i399;
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart'
    as _i116;
import 'package:dalil_dimashq/domain/usecase/sign_in_use_case.dart' as _i873;
import 'package:dalil_dimashq/domain/usecase/sign_out_use_case.dart' as _i334;
import 'package:dalil_dimashq/domain/usecase/sign_up_use_case.dart' as _i62;
import 'package:dalil_dimashq/domain/usecase/update_profile_phone_use_case.dart'
    as _i544;
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_bloc.dart'
    as _i199;
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_bloc.dart'
    as _i1047;
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_bloc.dart'
    as _i948;
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_bloc.dart'
    as _i162;
import 'package:dalil_dimashq/presentation/features/events/bloc/events_bloc.dart'
    as _i646;
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart'
    as _i805;
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart'
    as _i308;
import 'package:dalil_dimashq/presentation/features/legal/bloc/legal_bloc.dart'
    as _i659;
import 'package:dalil_dimashq/presentation/features/map/bloc/map_bloc.dart'
    as _i600;
import 'package:dalil_dimashq/presentation/features/offers/bloc/offers_bloc.dart'
    as _i367;
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart'
    as _i489;
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_bloc.dart'
    as _i700;
import 'package:dalil_dimashq/presentation/features/settings/bloc/delete_account_bloc.dart'
    as _i391;
import 'package:dalil_dimashq/presentation/features/settings/bloc/sign_out_bloc.dart'
    as _i60;
import 'package:dalil_dimashq/presentation/features/settings/bloc/site_contacts_bloc.dart'
    as _i879;
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
    gh.lazySingleton<_i100.NotificationPreferenceRepository>(
      () => _i390.NotificationPreferenceRepositoryImpl(
        gh<_i460.SharedPreferences>(),
      ),
    );
    gh.lazySingleton<_i149.LocaleRepository>(
      () => _i289.LocaleRepositoryImpl(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i845.DeviceLocation>(
      () => _i787.GeolocatorDeviceLocation(),
    );
    gh.lazySingleton<_i944.TokenStorage>(
      () => _i944.TokenStorage(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i820.PlaceLinks>(() => _i227.DevicePlaceLinks());
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
    gh.lazySingleton<_i371.AuthApiClient>(
      () => registerModule.authApiClient(gh<_i361.Dio>()),
    );
    gh.lazySingleton<_i413.ProfileApiClient>(
      () => registerModule.profileApiClient(gh<_i361.Dio>()),
    );
    gh.factory<_i308.LanguageBloc>(
      () => _i308.LanguageBloc(
        gh<_i1013.ReadLocaleUseCase>(),
        gh<_i399.SaveLocaleUseCase>(),
      ),
    );
    gh.lazySingleton<_i218.LegalRepository>(
      () => _i126.LegalRepositoryImpl(gh<_i413.ProfileApiClient>()),
    );
    gh.lazySingleton<_i360.DirectoryRemoteDataSource>(
      () => _i360.DirectoryRemoteDataSource(gh<_i807.DirectoryApiClient>()),
    );
    gh.lazySingleton<_i539.ProfileRepository>(
      () => _i352.ProfileRepositoryImpl(gh<_i413.ProfileApiClient>()),
    );
    gh.factory<_i901.AcceptLegalUseCase>(
      () => _i901.AcceptLegalUseCase(gh<_i218.LegalRepository>()),
    );
    gh.factory<_i140.LoadPendingLegalUseCase>(
      () => _i140.LoadPendingLegalUseCase(gh<_i218.LegalRepository>()),
    );
    gh.lazySingleton<_i242.AuthRepository>(
      () => _i327.AuthRepositoryImpl(
        gh<_i371.AuthApiClient>(),
        gh<_i944.TokenStorage>(),
      ),
    );
    gh.factory<_i867.DeleteAccountUseCase>(
      () => _i867.DeleteAccountUseCase(gh<_i242.AuthRepository>()),
    );
    gh.factory<_i244.RecoverPasswordUseCase>(
      () => _i244.RecoverPasswordUseCase(gh<_i242.AuthRepository>()),
    );
    gh.factory<_i873.SignInUseCase>(
      () => _i873.SignInUseCase(gh<_i242.AuthRepository>()),
    );
    gh.factory<_i334.SignOutUseCase>(
      () => _i334.SignOutUseCase(gh<_i242.AuthRepository>()),
    );
    gh.factory<_i62.SignUpUseCase>(
      () => _i62.SignUpUseCase(gh<_i242.AuthRepository>()),
    );
    gh.factory<_i787.CompleteProfileUseCase>(
      () => _i787.CompleteProfileUseCase(gh<_i539.ProfileRepository>()),
    );
    gh.factory<_i525.LoadProfileUseCase>(
      () => _i525.LoadProfileUseCase(gh<_i539.ProfileRepository>()),
    );
    gh.factory<_i578.RequestProfileChangeUseCase>(
      () => _i578.RequestProfileChangeUseCase(gh<_i539.ProfileRepository>()),
    );
    gh.factory<_i544.UpdateProfilePhoneUseCase>(
      () => _i544.UpdateProfilePhoneUseCase(gh<_i539.ProfileRepository>()),
    );
    gh.lazySingleton<_i203.EventRepository>(
      () => _i215.EventRepositoryImpl(gh<_i360.DirectoryRemoteDataSource>()),
    );
    gh.lazySingleton<_i921.OfferRepository>(
      () => _i908.OfferRepositoryImpl(gh<_i360.DirectoryRemoteDataSource>()),
    );
    gh.factory<_i391.DeleteAccountBloc>(
      () => _i391.DeleteAccountBloc(gh<_i867.DeleteAccountUseCase>()),
    );
    gh.lazySingleton<_i823.PlaceRepository>(
      () => _i401.PlaceRepositoryImpl(gh<_i360.DirectoryRemoteDataSource>()),
    );
    gh.factory<_i659.LegalBloc>(
      () => _i659.LegalBloc(
        gh<_i140.LoadPendingLegalUseCase>(),
        gh<_i901.AcceptLegalUseCase>(),
      ),
    );
    gh.factory<_i1047.SignInBloc>(
      () => _i1047.SignInBloc(gh<_i873.SignInUseCase>()),
    );
    gh.lazySingleton<_i1018.SiteContactRepository>(
      () =>
          _i31.SiteContactRepositoryImpl(gh<_i360.DirectoryRemoteDataSource>()),
    );
    gh.factory<_i654.GetPlaceUseCase>(
      () => _i654.GetPlaceUseCase(gh<_i823.PlaceRepository>()),
    );
    gh.factory<_i80.ListAreasUseCase>(
      () => _i80.ListAreasUseCase(gh<_i823.PlaceRepository>()),
    );
    gh.factory<_i116.SearchPlacesUseCase>(
      () => _i116.SearchPlacesUseCase(gh<_i823.PlaceRepository>()),
    );
    gh.factory<_i948.SignUpBloc>(
      () => _i948.SignUpBloc(gh<_i62.SignUpUseCase>()),
    );
    gh.factory<_i430.LoadSiteContactsUseCase>(
      () => _i430.LoadSiteContactsUseCase(gh<_i1018.SiteContactRepository>()),
    );
    gh.factory<_i489.PlaceBloc>(
      () => _i489.PlaceBloc(gh<_i654.GetPlaceUseCase>()),
    );
    gh.factory<_i60.SignOutBloc>(
      () => _i60.SignOutBloc(gh<_i334.SignOutUseCase>()),
    );
    gh.factory<_i460.ListEventsUseCase>(
      () => _i460.ListEventsUseCase(gh<_i203.EventRepository>()),
    );
    gh.factory<_i1024.ListOffersUseCase>(
      () => _i1024.ListOffersUseCase(gh<_i921.OfferRepository>()),
    );
    gh.factory<_i646.EventsBloc>(
      () => _i646.EventsBloc(gh<_i460.ListEventsUseCase>()),
    );
    gh.factory<_i199.RecoveryBloc>(
      () => _i199.RecoveryBloc(gh<_i244.RecoverPasswordUseCase>()),
    );
    gh.factory<_i162.BookingDraftBloc>(
      () => _i162.BookingDraftBloc(gh<_i525.LoadProfileUseCase>()),
    );
    gh.factory<_i700.ProfileBloc>(
      () => _i700.ProfileBloc(
        gh<_i525.LoadProfileUseCase>(),
        gh<_i787.CompleteProfileUseCase>(),
        gh<_i544.UpdateProfilePhoneUseCase>(),
        gh<_i578.RequestProfileChangeUseCase>(),
      ),
    );
    gh.factory<_i805.ExploreBloc>(
      () => _i805.ExploreBloc(
        gh<_i116.SearchPlacesUseCase>(),
        gh<_i80.ListAreasUseCase>(),
      ),
    );
    gh.factory<_i879.SiteContactsBloc>(
      () => _i879.SiteContactsBloc(gh<_i430.LoadSiteContactsUseCase>()),
    );
    gh.factory<_i600.MapBloc>(
      () => _i600.MapBloc(gh<_i116.SearchPlacesUseCase>()),
    );
    gh.factory<_i367.OffersBloc>(
      () => _i367.OffersBloc(gh<_i1024.ListOffersUseCase>()),
    );
    return this;
  }
}

class _$RegisterModule extends _i111.RegisterModule {}
