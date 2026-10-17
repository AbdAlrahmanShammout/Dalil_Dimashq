import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/profile_repository.dart';
import 'package:dalil_dimashq/domain/usecase/load_profile_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/save_profile_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_bloc.dart';
import 'package:dalil_dimashq/presentation/features/profile/pages/profile_page.dart';

void main() {
  testWidgets('name and phone load and can be saved', (
    WidgetTester tester,
  ) async {
    final _MemoryProfile repository = _MemoryProfile(
      const UserProfile(displayName: 'Nour', phone: '0999000000'),
    );
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: ProfilePage(
          bloc: ProfileBloc(
            LoadProfileUseCase(repository),
            SaveProfileUseCase(repository),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Nour'), findsOneWidget);
    expect(find.text('0999000000'), findsOneWidget);
    await tester.enterText(
      find.byKey(const Key('profile-phone')),
      '0988111111',
    );
    await tester.tap(find.text('Save'));
    await tester.pump();
    expect(repository.saved?.phone, '0988111111');
    expect(repository.saved?.displayName, 'Nour');
    expect(find.text('Profile saved'), findsOneWidget);
  });
}

class _MemoryProfile implements ProfileRepository {
  _MemoryProfile(this.current);

  UserProfile current;
  UserProfile? saved;

  @override
  Future<Either<Failure, UserProfile>> load() async {
    return Right(current);
  }

  @override
  Future<Either<Failure, UserProfile>> save(UserProfile profile) async {
    saved = profile;
    current = profile;
    return Right(profile);
  }
}
