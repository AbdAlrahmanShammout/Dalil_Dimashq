import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/core/network/dalil_error_catalog.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/features/settings/bloc/sign_out_bloc.dart';

class SignOutButton extends StatelessWidget {
  const SignOutButton({this.bloc, super.key});

  final SignOutBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<SignOutBloc>.value(
        value: bloc!,
        child: const _SignOutControl(),
      );
    }
    if (!getIt.isRegistered<SignOutBloc>()) {
      return const SizedBox.shrink();
    }
    return BlocProvider<SignOutBloc>(
      create: (BuildContext context) => getIt<SignOutBloc>(),
      child: const _SignOutControl(),
    );
  }
}

class _SignOutControl extends StatelessWidget {
  const _SignOutControl();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final String language = Localizations.localeOf(context).languageCode;
    return BlocConsumer<SignOutBloc, SignOutState>(
      listenWhen: (SignOutState previous, SignOutState current) =>
          current.isSignedOut && !previous.isSignedOut,
      listener: (BuildContext context, SignOutState state) {
        Navigator.of(context).popUntil((Route<void> route) => route.isFirst);
      },
      builder: (BuildContext context, SignOutState state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const SizedBox(height: 12),
            AppButton(
              label: l10n.signOut,
              onPressed: () {
                context.read<SignOutBloc>().add(const SignOutRequested());
              },
            ),
            if (state.errorCode != null)
              Text(dalilErrorText(state.errorCode!, language)),
          ],
        );
      },
    );
  }
}
