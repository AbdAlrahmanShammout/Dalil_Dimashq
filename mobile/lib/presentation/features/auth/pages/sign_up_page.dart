import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/sign_up_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_bloc.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_event.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_up_state.dart';

class SignUpPage extends StatelessWidget {
  const SignUpPage({this.bloc, super.key});

  final SignUpBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<SignUpBloc>.value(
        value: bloc!,
        child: const _SignUpForm(),
      );
    }
    return BlocProvider<SignUpBloc>(
      create: (BuildContext context) => getIt<SignUpBloc>(),
      child: const _SignUpForm(),
    );
  }
}

class _SignUpForm extends StatefulWidget {
  const _SignUpForm();

  @override
  State<_SignUpForm> createState() => _SignUpFormState();
}

class _SignUpFormState extends State<_SignUpForm> {
  final TextEditingController _email = TextEditingController();
  final TextEditingController _password = TextEditingController();
  final TextEditingController _name = TextEditingController();
  bool _isAtLeast16 = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    _name.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.signUp,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: <Widget>[
            TextField(
              key: const Key('sign-up-email'),
              controller: _email,
              decoration: InputDecoration(labelText: l10n.email),
            ),
            TextField(
              key: const Key('sign-up-password'),
              controller: _password,
              obscureText: true,
              decoration: InputDecoration(labelText: l10n.password),
            ),
            TextField(
              key: const Key('sign-up-name'),
              controller: _name,
              decoration: InputDecoration(labelText: l10n.displayName),
            ),
            CheckboxListTile(
              key: const Key('age-check'),
              value: _isAtLeast16,
              onChanged: (bool? value) {
                setState(() => _isAtLeast16 = value ?? false);
              },
              title: Text(l10n.ageCheck),
              controlAffinity: ListTileControlAffinity.leading,
            ),
            const SizedBox(height: 16),
            AppButton(
              label: l10n.createAccount,
              onPressed: () {
                context.read<SignUpBloc>().add(
                  SignUpSubmitted(
                    SignUpRequest(
                      email: _email.text,
                      password: _password.text,
                      displayName: _name.text,
                      isAtLeast16: _isAtLeast16,
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 16),
            BlocBuilder<SignUpBloc, SignUpState>(
              builder: (BuildContext context, SignUpState state) {
                return Text(
                  _message(l10n, state),
                  key: const Key('sign-up-message'),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  String _message(AppLocalizations l10n, SignUpState state) {
    if (state.status == SignUpStatus.success) {
      return l10n.confirmationSent;
    }
    if (state.failure is WeakPasswordFailure) {
      return l10n.passwordRule;
    }
    if (state.failure is AgeCheckFailure) {
      return l10n.ageRequired;
    }
    return '';
  }
}
