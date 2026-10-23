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
import 'package:dalil_dimashq/data/datasource/device_push_token_source.dart'
    as _i280;
import 'package:dalil_dimashq/data/datasource/local/device_place_links.dart'
    as _i227;
import 'package:dalil_dimashq/data/datasource/local/geolocator_device_location.dart'
    as _i787;
import 'package:dalil_dimashq/data/datasource/remote/auth_api_client.dart'
    as _i371;
import 'package:dalil_dimashq/data/datasource/remote/booking_api_client.dart'
    as _i990;
import 'package:dalil_dimashq/data/datasource/remote/contact_api_client.dart'
    as _i693;
import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart'
    as _i807;
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart'
    as _i360;
import 'package:dalil_dimashq/data/datasource/remote/notification_api_client.dart'
    as _i100;
import 'package:dalil_dimashq/data/datasource/remote/owner_api_client.dart'
    as _i272;
import 'package:dalil_dimashq/data/datasource/remote/profile_api_client.dart'
    as _i413;
import 'package:dalil_dimashq/data/datasource/remote/suggestion_api_client.dart'
    as _i954;
import 'package:dalil_dimashq/data/datasource/system_notification_permission.dart'
    as _i791;
import 'package:dalil_dimashq/data/repository/auth_repository_impl.dart'
    as _i327;
import 'package:dalil_dimashq/data/repository/booking_repository_impl.dart'
    as _i88;
import 'package:dalil_dimashq/data/repository/change_request_repository_impl.dart'
    as _i298;
import 'package:dalil_dimashq/data/repository/contact_repository_impl.dart'
    as _i453;
import 'package:dalil_dimashq/data/repository/device_repository_impl.dart'
    as _i415;
import 'package:dalil_dimashq/data/repository/event_repository_impl.dart'
    as _i215;
import 'package:dalil_dimashq/data/repository/legal_repository_impl.dart'
    as _i126;
import 'package:dalil_dimashq/data/repository/locale_repository_impl.dart'
    as _i289;
import 'package:dalil_dimashq/data/repository/notification_preference_repository_impl.dart'
    as _i390;
import 'package:dalil_dimashq/data/repository/notification_repository_impl.dart'
    as _i591;
import 'package:dalil_dimashq/data/repository/offer_repository_impl.dart'
    as _i908;
import 'package:dalil_dimashq/data/repository/owner_dashboard_repository_impl.dart'
    as _i459;
import 'package:dalil_dimashq/data/repository/owner_place_repository_impl.dart'
    as _i238;
import 'package:dalil_dimashq/data/repository/place_claim_repository_impl.dart'
    as _i404;
import 'package:dalil_dimashq/data/repository/place_edit_repository_impl.dart'
    as _i547;
import 'package:dalil_dimashq/data/repository/place_name_search_repository_impl.dart'
    as _i962;
import 'package:dalil_dimashq/data/repository/place_repository_impl.dart'
    as _i401;
import 'package:dalil_dimashq/data/repository/premium_repository_impl.dart'
    as _i234;
import 'package:dalil_dimashq/data/repository/profile_repository_impl.dart'
    as _i352;
import 'package:dalil_dimashq/data/repository/session_repository_impl.dart'
    as _i88;
import 'package:dalil_dimashq/data/repository/site_contact_repository_impl.dart'
    as _i31;
import 'package:dalil_dimashq/data/repository/suggestion_repository_impl.dart'
    as _i1061;
import 'package:dalil_dimashq/domain/repositories/auth_repository.dart'
    as _i242;
import 'package:dalil_dimashq/domain/repositories/booking_repository.dart'
    as _i625;
import 'package:dalil_dimashq/domain/repositories/change_request_repository.dart'
    as _i390;
import 'package:dalil_dimashq/domain/repositories/contact_repository.dart'
    as _i262;
import 'package:dalil_dimashq/domain/repositories/device_repository.dart'
    as _i766;
import 'package:dalil_dimashq/domain/repositories/event_repository.dart'
    as _i203;
import 'package:dalil_dimashq/domain/repositories/legal_repository.dart'
    as _i218;
import 'package:dalil_dimashq/domain/repositories/locale_repository.dart'
    as _i149;
import 'package:dalil_dimashq/domain/repositories/notification_preference_repository.dart'
    as _i100;
import 'package:dalil_dimashq/domain/repositories/notification_repository.dart'
    as _i1059;
import 'package:dalil_dimashq/domain/repositories/offer_repository.dart'
    as _i921;
import 'package:dalil_dimashq/domain/repositories/owner_dashboard_repository.dart'
    as _i996;
import 'package:dalil_dimashq/domain/repositories/owner_place_repository.dart'
    as _i266;
import 'package:dalil_dimashq/domain/repositories/place_claim_repository.dart'
    as _i158;
import 'package:dalil_dimashq/domain/repositories/place_edit_repository.dart'
    as _i188;
import 'package:dalil_dimashq/domain/repositories/place_name_search_repository.dart'
    as _i760;
import 'package:dalil_dimashq/domain/repositories/place_repository.dart'
    as _i823;
import 'package:dalil_dimashq/domain/repositories/premium_repository.dart'
    as _i13;
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart'
    as _i539;
import 'package:dalil_dimashq/domain/repositories/session_repository.dart'
    as _i366;
import 'package:dalil_dimashq/domain/repositories/site_contact_repository.dart'
    as _i1018;
import 'package:dalil_dimashq/domain/repositories/suggestion_repository.dart'
    as _i406;
import 'package:dalil_dimashq/domain/services/booking_clock.dart' as _i183;
import 'package:dalil_dimashq/domain/services/device_location.dart' as _i845;
import 'package:dalil_dimashq/domain/services/device_push_token.dart' as _i800;
import 'package:dalil_dimashq/domain/services/notification_permission.dart'
    as _i423;
import 'package:dalil_dimashq/domain/services/place_links.dart' as _i820;
import 'package:dalil_dimashq/domain/usecase/accept_legal_use_case.dart'
    as _i901;
import 'package:dalil_dimashq/domain/usecase/cancel_booking_use_case.dart'
    as _i1005;
import 'package:dalil_dimashq/domain/usecase/claim_place_use_case.dart'
    as _i631;
import 'package:dalil_dimashq/domain/usecase/complete_profile_use_case.dart'
    as _i787;
import 'package:dalil_dimashq/domain/usecase/create_booking_use_case.dart'
    as _i630;
import 'package:dalil_dimashq/domain/usecase/delete_account_use_case.dart'
    as _i867;
import 'package:dalil_dimashq/domain/usecase/get_place_use_case.dart' as _i654;
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart'
    as _i261;
import 'package:dalil_dimashq/domain/usecase/list_areas_use_case.dart' as _i80;
import 'package:dalil_dimashq/domain/usecase/list_bookings_use_case.dart'
    as _i194;
import 'package:dalil_dimashq/domain/usecase/list_events_use_case.dart'
    as _i460;
import 'package:dalil_dimashq/domain/usecase/list_notifications_use_case.dart'
    as _i1047;
import 'package:dalil_dimashq/domain/usecase/list_offers_use_case.dart'
    as _i1024;
import 'package:dalil_dimashq/domain/usecase/list_owned_places_use_case.dart'
    as _i602;
import 'package:dalil_dimashq/domain/usecase/load_booking_availability_use_case.dart'
    as _i283;
import 'package:dalil_dimashq/domain/usecase/load_booking_ban_use_case.dart'
    as _i875;
import 'package:dalil_dimashq/domain/usecase/load_booking_use_case.dart'
    as _i67;
import 'package:dalil_dimashq/domain/usecase/load_owner_dashboard_use_case.dart'
    as _i506;
import 'package:dalil_dimashq/domain/usecase/load_pending_legal_use_case.dart'
    as _i140;
import 'package:dalil_dimashq/domain/usecase/load_premium_use_case.dart'
    as _i712;
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart'
    as _i525;
import 'package:dalil_dimashq/domain/usecase/load_site_contacts_use_case.dart'
    as _i430;
import 'package:dalil_dimashq/domain/usecase/open_notification_use_case.dart'
    as _i148;
import 'package:dalil_dimashq/domain/usecase/read_locale_use_case.dart'
    as _i1013;
import 'package:dalil_dimashq/domain/usecase/recover_password_use_case.dart'
    as _i244;
import 'package:dalil_dimashq/domain/usecase/register_device_use_case.dart'
    as _i889;
import 'package:dalil_dimashq/domain/usecase/reply_fake_report_use_case.dart'
    as _i798;
import 'package:dalil_dimashq/domain/usecase/request_profile_change_use_case.dart'
    as _i578;
import 'package:dalil_dimashq/domain/usecase/save_immediate_fields_use_case.dart'
    as _i974;
import 'package:dalil_dimashq/domain/usecase/save_locale_use_case.dart'
    as _i399;
import 'package:dalil_dimashq/domain/usecase/search_places_by_name_use_case.dart'
    as _i7;
import 'package:dalil_dimashq/domain/usecase/search_places_use_case.dart'
    as _i116;
import 'package:dalil_dimashq/domain/usecase/send_contact_message_use_case.dart'
    as _i480;
import 'package:dalil_dimashq/domain/usecase/sign_in_use_case.dart' as _i873;
import 'package:dalil_dimashq/domain/usecase/sign_out_use_case.dart' as _i334;
import 'package:dalil_dimashq/domain/usecase/sign_up_use_case.dart' as _i62;
import 'package:dalil_dimashq/domain/usecase/submit_claim_use_case.dart'
    as _i637;
import 'package:dalil_dimashq/domain/usecase/submit_reviewed_changes_use_case.dart'
    as _i837;
import 'package:dalil_dimashq/domain/usecase/submit_suggestion_use_case.dart'
    as _i101;
import 'package:dalil_dimashq/domain/usecase/update_profile_phone_use_case.dart'
    as _i544;
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_bloc.dart'
    as _i199;
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_bloc.dart'
    as _i1047;
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_bloc.dart'
    as _i948;
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_details_bloc.dart'
    as _i613;
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_bloc.dart'
    as _i162;
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_gate_bloc.dart'
    as _i384;
import 'package:dalil_dimashq/presentation/features/booking/bloc/my_bookings_bloc.dart'
    as _i734;
import 'package:dalil_dimashq/presentation/features/contact/bloc/contact_bloc.dart'
    as _i587;
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
import 'package:dalil_dimashq/presentation/features/notifications/bloc/inbox_bloc.dart'
    as _i481;
import 'package:dalil_dimashq/presentation/features/offers/bloc/offers_bloc.dart'
    as _i367;
import 'package:dalil_dimashq/presentation/features/owner/bloc/claim_place_bloc.dart'
    as _i321;
import 'package:dalil_dimashq/presentation/features/owner/bloc/immediate_fields_bloc.dart'
    as _i1066;
import 'package:dalil_dimashq/presentation/features/owner/bloc/my_places_bloc.dart'
    as _i478;
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_dashboard_bloc.dart'
    as _i635;
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_place_search_bloc.dart'
    as _i589;
import 'package:dalil_dimashq/presentation/features/owner/bloc/premium_bloc.dart'
    as _i241;
import 'package:dalil_dimashq/presentation/features/owner/bloc/reviewed_changes_bloc.dart'
    as _i970;
import 'package:dalil_dimashq/presentation/features/owner/bloc/submit_claim_bloc.dart'
    as _i630;
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
import 'package:dalil_dimashq/presentation/features/suggestion/bloc/suggestion_bloc.dart'
    as _i52;
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
    gh.lazySingleton<_i693.ContactApiClient>(
      () => registerModule.contactApiClient(),
    );
    gh.lazySingleton<_i183.BookingClock>(() => _i183.BookingClock());
    gh.lazySingleton<_i100.NotificationPreferenceRepository>(
      () => _i390.NotificationPreferenceRepositoryImpl(
        gh<_i460.SharedPreferences>(),
      ),
    );
    gh.lazySingleton<_i149.LocaleRepository>(
      () => _i289.LocaleRepositoryImpl(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i800.DevicePushToken>(
      () => const _i280.DevicePushTokenSource(),
    );
    gh.lazySingleton<_i845.DeviceLocation>(
      () => _i787.GeolocatorDeviceLocation(),
    );
    gh.lazySingleton<_i480.ContactHistory>(
      () => _i453.ContactHistoryImpl(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i944.TokenStorage>(
      () => _i944.TokenStorage(gh<_i460.SharedPreferences>()),
    );
    gh.lazySingleton<_i423.NotificationPermission>(
      () => const _i791.SystemNotificationPermission(),
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
    gh.lazySingleton<_i262.ContactRepository>(
      () => _i453.ContactRepositoryImpl(gh<_i693.ContactApiClient>()),
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
    gh.lazySingleton<_i272.OwnerApiClient>(
      () => registerModule.ownerApiClient(gh<_i361.Dio>()),
    );
    gh.lazySingleton<_i371.AuthApiClient>(
      () => registerModule.authApiClient(gh<_i361.Dio>()),
    );
    gh.lazySingleton<_i990.BookingApiClient>(
      () => registerModule.bookingApiClient(gh<_i361.Dio>()),
    );
    gh.lazySingleton<_i100.NotificationApiClient>(
      () => registerModule.notificationApiClient(gh<_i361.Dio>()),
    );
    gh.lazySingleton<_i413.ProfileApiClient>(
      () => registerModule.profileApiClient(gh<_i361.Dio>()),
    );
    gh.lazySingleton<_i954.SuggestionApiClient>(
      () => registerModule.suggestionApiClient(gh<_i361.Dio>()),
    );
    gh.factory<_i480.SendContactMessageUseCase>(
      () => _i480.SendContactMessageUseCase(
        gh<_i262.ContactRepository>(),
        gh<_i480.ContactHistory>(),
      ),
    );
    gh.lazySingleton<_i266.OwnerPlaceRepository>(
      () => _i238.OwnerPlaceRepositoryImpl(gh<_i272.OwnerApiClient>()),
    );
    gh.factory<_i587.ContactBloc>(
      () => _i587.ContactBloc(gh<_i480.SendContactMessageUseCase>()),
    );
    gh.lazySingleton<_i158.PlaceClaimRepository>(
      () => _i404.PlaceClaimRepositoryImpl(gh<_i272.OwnerApiClient>()),
    );
    gh.factory<_i308.LanguageBloc>(
      () => _i308.LanguageBloc(
        gh<_i1013.ReadLocaleUseCase>(),
        gh<_i399.SaveLocaleUseCase>(),
      ),
    );
    gh.lazySingleton<_i996.OwnerDashboardRepository>(
      () => _i459.OwnerDashboardRepositoryImpl(gh<_i272.OwnerApiClient>()),
    );
    gh.factory<_i631.ClaimPlaceUseCase>(
      () => _i631.ClaimPlaceUseCase(gh<_i158.PlaceClaimRepository>()),
    );
    gh.lazySingleton<_i406.SuggestionRepository>(
      () => _i1061.SuggestionRepositoryImpl(gh<_i954.SuggestionApiClient>()),
    );
    gh.lazySingleton<_i13.PremiumRepository>(
      () => _i234.PremiumRepositoryImpl(gh<_i272.OwnerApiClient>()),
    );
    gh.lazySingleton<_i625.BookingRepository>(
      () => _i88.BookingRepositoryImpl(gh<_i990.BookingApiClient>()),
    );
    gh.lazySingleton<_i188.PlaceEditRepository>(
      () => _i547.PlaceEditRepositoryImpl(gh<_i272.OwnerApiClient>()),
    );
    gh.lazySingleton<_i218.LegalRepository>(
      () => _i126.LegalRepositoryImpl(gh<_i413.ProfileApiClient>()),
    );
    gh.lazySingleton<_i760.PlaceNameSearchRepository>(
      () => _i962.PlaceNameSearchRepositoryImpl(gh<_i272.OwnerApiClient>()),
    );
    gh.lazySingleton<_i360.DirectoryRemoteDataSource>(
      () => _i360.DirectoryRemoteDataSource(gh<_i807.DirectoryApiClient>()),
    );
    gh.lazySingleton<_i539.ProfileRepository>(
      () => _i352.ProfileRepositoryImpl(gh<_i413.ProfileApiClient>()),
    );
    gh.factory<_i1005.CancelBookingUseCase>(
      () => _i1005.CancelBookingUseCase(gh<_i625.BookingRepository>()),
    );
    gh.factory<_i630.CreateBookingUseCase>(
      () => _i630.CreateBookingUseCase(gh<_i625.BookingRepository>()),
    );
    gh.factory<_i194.ListBookingsUseCase>(
      () => _i194.ListBookingsUseCase(gh<_i625.BookingRepository>()),
    );
    gh.factory<_i283.LoadBookingAvailabilityUseCase>(
      () => _i283.LoadBookingAvailabilityUseCase(gh<_i625.BookingRepository>()),
    );
    gh.factory<_i875.LoadBookingBanUseCase>(
      () => _i875.LoadBookingBanUseCase(gh<_i625.BookingRepository>()),
    );
    gh.factory<_i67.LoadBookingUseCase>(
      () => _i67.LoadBookingUseCase(gh<_i625.BookingRepository>()),
    );
    gh.factory<_i798.ReplyFakeReportUseCase>(
      () => _i798.ReplyFakeReportUseCase(gh<_i625.BookingRepository>()),
    );
    gh.lazySingleton<_i390.ChangeRequestRepository>(
      () => _i298.ChangeRequestRepositoryImpl(gh<_i272.OwnerApiClient>()),
    );
    gh.lazySingleton<_i1059.NotificationRepository>(
      () => _i591.NotificationRepositoryImpl(gh<_i100.NotificationApiClient>()),
    );
    gh.factory<_i901.AcceptLegalUseCase>(
      () => _i901.AcceptLegalUseCase(gh<_i218.LegalRepository>()),
    );
    gh.factory<_i140.LoadPendingLegalUseCase>(
      () => _i140.LoadPendingLegalUseCase(gh<_i218.LegalRepository>()),
    );
    gh.factory<_i101.SubmitSuggestionUseCase>(
      () => _i101.SubmitSuggestionUseCase(gh<_i406.SuggestionRepository>()),
    );
    gh.lazySingleton<_i766.DeviceRepository>(
      () => _i415.DeviceRepositoryImpl(gh<_i100.NotificationApiClient>()),
    );
    gh.lazySingleton<_i242.AuthRepository>(
      () => _i327.AuthRepositoryImpl(
        gh<_i371.AuthApiClient>(),
        gh<_i944.TokenStorage>(),
      ),
    );
    gh.factory<_i637.SubmitClaimUseCase>(
      () => _i637.SubmitClaimUseCase(gh<_i390.ChangeRequestRepository>()),
    );
    gh.factory<_i837.SubmitReviewedChangesUseCase>(
      () => _i837.SubmitReviewedChangesUseCase(
        gh<_i390.ChangeRequestRepository>(),
      ),
    );
    gh.factory<_i602.ListOwnedPlacesUseCase>(
      () => _i602.ListOwnedPlacesUseCase(gh<_i266.OwnerPlaceRepository>()),
    );
    gh.factory<_i506.LoadOwnerDashboardUseCase>(
      () =>
          _i506.LoadOwnerDashboardUseCase(gh<_i996.OwnerDashboardRepository>()),
    );
    gh.factory<_i321.ClaimPlaceBloc>(
      () => _i321.ClaimPlaceBloc(gh<_i631.ClaimPlaceUseCase>()),
    );
    gh.factory<_i478.MyPlacesBloc>(
      () => _i478.MyPlacesBloc(gh<_i602.ListOwnedPlacesUseCase>()),
    );
    gh.factory<_i712.LoadPremiumUseCase>(
      () => _i712.LoadPremiumUseCase(gh<_i13.PremiumRepository>()),
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
    gh.factory<_i52.SuggestionBloc>(
      () => _i52.SuggestionBloc(gh<_i101.SubmitSuggestionUseCase>()),
    );
    gh.lazySingleton<_i823.PlaceRepository>(
      () => _i401.PlaceRepositoryImpl(gh<_i360.DirectoryRemoteDataSource>()),
    );
    gh.factory<_i148.OpenNotificationUseCase>(
      () => _i148.OpenNotificationUseCase(
        gh<_i1059.NotificationRepository>(),
        gh<_i67.LoadBookingUseCase>(),
      ),
    );
    gh.factory<_i241.PremiumBloc>(
      () => _i241.PremiumBloc(gh<_i712.LoadPremiumUseCase>()),
    );
    gh.factory<_i734.MyBookingsBloc>(
      () => _i734.MyBookingsBloc(gh<_i194.ListBookingsUseCase>()),
    );
    gh.factory<_i970.ReviewedChangesBloc>(
      () => _i970.ReviewedChangesBloc(gh<_i837.SubmitReviewedChangesUseCase>()),
    );
    gh.factory<_i659.LegalBloc>(
      () => _i659.LegalBloc(
        gh<_i140.LoadPendingLegalUseCase>(),
        gh<_i901.AcceptLegalUseCase>(),
      ),
    );
    gh.factory<_i630.SubmitClaimBloc>(
      () => _i630.SubmitClaimBloc(gh<_i637.SubmitClaimUseCase>()),
    );
    gh.factory<_i7.SearchPlacesByNameUseCase>(
      () =>
          _i7.SearchPlacesByNameUseCase(gh<_i760.PlaceNameSearchRepository>()),
    );
    gh.factory<_i1047.SignInBloc>(
      () => _i1047.SignInBloc(gh<_i873.SignInUseCase>()),
    );
    gh.factory<_i384.BookingGateBloc>(
      () => _i384.BookingGateBloc(
        gh<_i283.LoadBookingAvailabilityUseCase>(),
        gh<_i261.HasSessionUseCase>(),
        gh<_i875.LoadBookingBanUseCase>(),
      ),
    );
    gh.factory<_i162.BookingDraftBloc>(
      () => _i162.BookingDraftBloc(
        gh<_i525.LoadProfileUseCase>(),
        gh<_i283.LoadBookingAvailabilityUseCase>(),
        gh<_i183.BookingClock>(),
        gh<_i630.CreateBookingUseCase>(),
        gh<_i67.LoadBookingUseCase>(),
      ),
    );
    gh.factory<_i974.SaveImmediateFieldsUseCase>(
      () => _i974.SaveImmediateFieldsUseCase(
        gh<_i188.PlaceEditRepository>(),
        gh<_i13.PremiumRepository>(),
      ),
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
    gh.factory<_i1047.ListNotificationsUseCase>(
      () =>
          _i1047.ListNotificationsUseCase(gh<_i1059.NotificationRepository>()),
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
    gh.factory<_i635.OwnerDashboardBloc>(
      () => _i635.OwnerDashboardBloc(gh<_i506.LoadOwnerDashboardUseCase>()),
    );
    gh.factory<_i889.RegisterDeviceUseCase>(
      () => _i889.RegisterDeviceUseCase(
        gh<_i766.DeviceRepository>(),
        gh<_i800.DevicePushToken>(),
      ),
    );
    gh.factory<_i60.SignOutBloc>(
      () => _i60.SignOutBloc(gh<_i334.SignOutUseCase>()),
    );
    gh.factory<_i460.ListEventsUseCase>(
      () => _i460.ListEventsUseCase(gh<_i203.EventRepository>()),
    );
    gh.factory<_i1066.ImmediateFieldsBloc>(
      () => _i1066.ImmediateFieldsBloc(gh<_i974.SaveImmediateFieldsUseCase>()),
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
    gh.factory<_i700.ProfileBloc>(
      () => _i700.ProfileBloc(
        gh<_i525.LoadProfileUseCase>(),
        gh<_i787.CompleteProfileUseCase>(),
        gh<_i544.UpdateProfilePhoneUseCase>(),
        gh<_i578.RequestProfileChangeUseCase>(),
      ),
    );
    gh.factory<_i613.BookingDetailsBloc>(
      () => _i613.BookingDetailsBloc(
        gh<_i654.GetPlaceUseCase>(),
        gh<_i1005.CancelBookingUseCase>(),
        gh<_i798.ReplyFakeReportUseCase>(),
      ),
    );
    gh.factory<_i805.ExploreBloc>(
      () => _i805.ExploreBloc(
        gh<_i116.SearchPlacesUseCase>(),
        gh<_i80.ListAreasUseCase>(),
      ),
    );
    gh.factory<_i589.OwnerPlaceSearchBloc>(
      () => _i589.OwnerPlaceSearchBloc(gh<_i7.SearchPlacesByNameUseCase>()),
    );
    gh.factory<_i481.InboxBloc>(
      () => _i481.InboxBloc(
        gh<_i1047.ListNotificationsUseCase>(),
        gh<_i148.OpenNotificationUseCase>(),
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
