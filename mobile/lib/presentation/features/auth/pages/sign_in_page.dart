import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/sign_in_request.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_bloc.dart';
import 'package:dalil_dimashq/presentation/features/auth/pages/recovery_page.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_event.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/sign_in_state.dart';

class SignInPage extends StatelessWidget {
  const SignInPage({this.bloc, super.key});

  final SignInBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<SignInBloc>.value(
        value: bloc!,
        child: const _SignInForm(),
      );
    }
    return BlocProvider<SignInBloc>(
      create: (BuildContext context) => getIt<SignInBloc>(),
      child: const _SignInForm(),
    );
  }
}

class _SignInForm extends StatefulWidget {
  const _SignInForm();

  @override
  State<_SignInForm> createState() => _SignInFormState();
}

class _SignInFormState extends State<_SignInForm> {
  final TextEditingController _email = TextEditingController();
  final TextEditingController _password = TextEditingController();

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.signIn,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: <Widget>[
            TextField(
              key: const Key('sign-in-email'),
              controller: _email,
              decoration: InputDecoration(labelText: l10n.email),
            ),
            TextField(
              key: const Key('sign-in-password'),
              controller: _password,
              obscureText: true,
              decoration: InputDecoration(labelText: l10n.password),
            ),
            const SizedBox(height: 16),
            AppButton(
              label: l10n.signIn,
              onPressed: () {
                context.read<SignInBloc>().add(
                  SignInSubmitted(
                    SignInRequest(email: _email.text, password: _password.text),
                  ),
                );
              },
            ),
            TextButton(
              key: const Key('forgot-password'),
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) => const RecoveryPage(),
                  ),
                );
              },
              child: Text(l10n.forgotPassword),
            ),
            const SizedBox(height: 16),
            BlocBuilder<SignInBloc, SignInState>(
              builder: (BuildContext context, SignInState state) {
                return Text(
                  _message(l10n, state),
                  key: const Key('sign-in-message'),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  String _message(AppLocalizations l10n, SignInState state) {
    if (state.status == SignInStatus.success) {
      return l10n.signedIn;
    }
    if (state.failure is EmailNotConfirmedFailure) {
      return l10n.confirmEmailFirst;
    }
    return '';
  }
}
