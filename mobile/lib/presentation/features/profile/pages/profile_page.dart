import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/core/network/dalil_error_catalog.dart';
import 'package:dalil_dimashq/domain/entities/user_profile.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_bloc.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_event.dart';
import 'package:dalil_dimashq/presentation/features/profile/bloc/profile_state.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({this.bloc, super.key});

  final ProfileBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<ProfileBloc>.value(
        value: bloc!..add(const ProfileStarted()),
        child: const _ProfileForm(),
      );
    }
    return BlocProvider<ProfileBloc>(
      create: (BuildContext context) =>
          getIt<ProfileBloc>()..add(const ProfileStarted()),
      child: const _ProfileForm(),
    );
  }
}

class _ProfileForm extends StatefulWidget {
  const _ProfileForm();

  @override
  State<_ProfileForm> createState() => _ProfileFormState();
}

class _ProfileFormState extends State<_ProfileForm> {
  final TextEditingController _firstName = TextEditingController();
  final TextEditingController _lastName = TextEditingController();
  final TextEditingController _phone = TextEditingController();
  final TextEditingController _birthYear = TextEditingController();
  bool _didFill = false;

  @override
  void dispose() {
    _firstName.dispose();
    _lastName.dispose();
    _phone.dispose();
    _birthYear.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.profile,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: BlocConsumer<ProfileBloc, ProfileState>(
          listener: (BuildContext context, ProfileState state) {
            if (_didFill || state.isLoading) {
              return;
            }
            _fill(state.profile);
            _didFill = true;
          },
          builder: (BuildContext context, ProfileState state) {
            final bool lockIdentity =
                state.profile.isComplete && state.profile.hasPendingChange;
            final String language = Localizations.localeOf(
              context,
            ).languageCode;
            return ListView(
              children: <Widget>[
                TextField(
                  key: const Key('profile-first-name'),
                  controller: _firstName,
                  enabled: !lockIdentity,
                  decoration: InputDecoration(labelText: l10n.firstName),
                ),
                TextField(
                  key: const Key('profile-last-name'),
                  controller: _lastName,
                  enabled: !lockIdentity,
                  decoration: InputDecoration(labelText: l10n.lastName),
                ),
                TextField(
                  key: const Key('profile-phone'),
                  controller: _phone,
                  decoration: InputDecoration(labelText: l10n.phone),
                ),
                TextField(
                  key: const Key('profile-birth-year'),
                  controller: _birthYear,
                  enabled: !lockIdentity,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(labelText: l10n.birthYear),
                ),
                const SizedBox(height: 16),
                AppButton(
                  label: state.profile.isComplete ? l10n.save : l10n.completeProfile,
                  onPressed: () {
                    context.read<ProfileBloc>().add(
                      ProfileSubmitted(
                        firstName: _firstName.text,
                        lastName: _lastName.text,
                        phone: _phone.text,
                        birthYearText: _birthYear.text,
                        language: language == 'en' ? 'en' : 'ar',
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
                Text(
                  _status(l10n, state, language),
                  key: const Key('profile-message'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _fill(UserProfile profile) {
    _firstName.text = profile.firstName;
    _lastName.text = profile.lastName;
    _phone.text = profile.phone;
    _birthYear.text = profile.birthYear?.toString() ?? '';
  }

  String _status(AppLocalizations l10n, ProfileState state, String language) {
    if (state.profile.hasPendingChange) {
      return l10n.profileChangePending;
    }
    if (state.errorCode != null) {
      return dalilErrorText(state.errorCode!, language);
    }
    if (state.isSaved) {
      return l10n.profileSaved;
    }
    return '';
  }
}
