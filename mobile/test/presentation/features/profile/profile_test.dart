import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:dalil_dimashq/domain/usecase/complete_profile_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/request_profile_change_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/update_profile_phone_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_bloc.dart';
import 'package:dalil_dimashq/presentation/features/profile/pages/profile_page.dart';

void main() {
  testWidgets('an incomplete profile is completed through the server', (
    WidgetTester tester,
  ) async {
    final _MemoryProfile repository = _MemoryProfile(const UserProfile());
    await tester.pumpWidget(_app(repository));
    await tester.pump();
    await tester.enterText(find.byKey(const Key('profile-first-name')), 'Nour');
    await tester.enterText(find.byKey(const Key('profile-last-name')), 'Hassan');
    await tester.enterText(find.byKey(const Key('profile-phone')), '0999000000');
    await tester.enterText(find.byKey(const Key('profile-birth-year')), '2000');
    await tester.tap(find.text('Complete profile'));
    await tester.pump();
    expect(repository.completed?.firstName, 'Nour');
    expect(repository.completed?.phone, '0999000000');
    expect(repository.completed?.birthYear, 2000);
    expect(repository.updatedPhone, isNull);
    expect(find.text('Profile saved'), findsOneWidget);
  });

  testWidgets('a complete profile updates the phone and requests a name change', (
    WidgetTester tester,
  ) async {
    final _MemoryProfile repository = _MemoryProfile(
      const UserProfile(
        displayName: 'Nour Hassan',
        firstName: 'Nour',
        lastName: 'Hassan',
        phone: '0999000000',
        birthYear: 2000,
        isComplete: true,
      ),
    );
    await tester.pumpWidget(_app(repository));
    await tester.pump();
    await tester.enterText(find.byKey(const Key('profile-phone')), '0988111111');
    await tester.enterText(find.byKey(const Key('profile-first-name')), 'Noor');
    await tester.tap(find.text('Save'));
    await tester.pump();
    expect(repository.updatedPhone, '0988111111');
    expect(repository.requested?.firstName, 'Noor');
    expect(find.text('Your name change is under review'), findsOneWidget);
  });
}

Widget _app(_MemoryProfile repository) {
  return MaterialApp(
    locale: const Locale('en'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: ProfilePage(
      bloc: ProfileBloc(
        LoadProfileUseCase(repository),
        CompleteProfileUseCase(repository),
        UpdateProfilePhoneUseCase(repository),
        RequestProfileChangeUseCase(repository),
      ),
    ),
  );
}

class _MemoryProfile implements ProfileRepository {
  _MemoryProfile(this.current);

  UserProfile current;
  ProfileDraft? completed;
  String? updatedPhone;
  ProfileDraft? requested;

  @override
  Future<Either<Failure, UserProfile>> load() async => Right(current);

  @override
  Future<Either<Failure, UserProfile>> complete(ProfileDraft draft) async {
    completed = draft;
    current = UserProfile(
      displayName: '${draft.firstName} ${draft.lastName}',
      firstName: draft.firstName,
      lastName: draft.lastName,
      phone: draft.phone,
      birthYear: draft.birthYear,
      language: draft.language,
      isComplete: true,
    );
    return Right(current);
  }

  @override
  Future<Either<Failure, UserProfile>> updatePhone({
    required String phone,
    required String language,
  }) async {
    updatedPhone = phone;
    current = UserProfile(
      displayName: current.displayName,
      firstName: current.firstName,
      lastName: current.lastName,
      phone: phone,
      birthYear: current.birthYear,
      language: language,
      isComplete: true,
      hasPendingChange: current.hasPendingChange,
    );
    return Right(current);
  }

  @override
  Future<Either<Failure, UserProfile>> requestChange(ProfileDraft draft) async {
    requested = draft;
    current = UserProfile(
      displayName: current.displayName,
      firstName: current.firstName,
      lastName: current.lastName,
      phone: current.phone,
      birthYear: current.birthYear,
      isComplete: true,
      hasPendingChange: true,
    );
    return Right(current);
  }
}
