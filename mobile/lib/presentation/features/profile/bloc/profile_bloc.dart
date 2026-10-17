import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/save_profile_use_case.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_event.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_state.dart';

@injectable
class ProfileBloc extends Bloc<ProfileEvent, ProfileState> {
  ProfileBloc(this._loadProfile, this._saveProfile)
    : super(const ProfileState()) {
    on<ProfileStarted>(_onStarted);
    on<ProfileSaved>(_onSaved);
  }

  final LoadProfileUseCase _loadProfile;
  final SaveProfileUseCase _saveProfile;

  Future<void> _onStarted(
    ProfileStarted event,
    Emitter<ProfileState> emit,
  ) async {
    emit(state.copyWith(isLoading: true, isSaved: false));
    final Either<Failure, UserProfile> result = await _loadProfile();
    result.fold((Failure failure) => emit(state.copyWith(isLoading: false)), (
      UserProfile profile,
    ) {
      emit(
        ProfileState(displayName: profile.displayName, phone: profile.phone),
      );
    });
  }

  Future<void> _onSaved(ProfileSaved event, Emitter<ProfileState> emit) async {
    final Either<Failure, UserProfile> result = await _saveProfile(
      event.profile,
    );
    result.fold((Failure failure) => emit(state.copyWith(isSaved: false)), (
      UserProfile profile,
    ) {
      emit(
        ProfileState(
          displayName: profile.displayName,
          phone: profile.phone,
          isSaved: true,
        ),
      );
    });
  }
}
