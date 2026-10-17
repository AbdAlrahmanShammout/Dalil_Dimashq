import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
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
  final TextEditingController _name = TextEditingController();
  final TextEditingController _phone = TextEditingController();
  bool _didFill = false;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
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
            _name.text = state.displayName;
            _phone.text = state.phone;
            _didFill = true;
          },
          builder: (BuildContext context, ProfileState state) {
            return Column(
              children: <Widget>[
                TextField(
                  key: const Key('profile-name'),
                  controller: _name,
                  decoration: InputDecoration(labelText: l10n.displayName),
                ),
                TextField(
                  key: const Key('profile-phone'),
                  controller: _phone,
                  decoration: InputDecoration(labelText: l10n.phone),
                ),
                const SizedBox(height: 16),
                AppButton(
                  label: l10n.save,
                  onPressed: () {
                    context.read<ProfileBloc>().add(
                      ProfileSaved(
                        UserProfile(
                          displayName: _name.text,
                          phone: _phone.text,
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
                Text(
                  state.isSaved ? l10n.profileSaved : '',
                  key: const Key('profile-message'),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
