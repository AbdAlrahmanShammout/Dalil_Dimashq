import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/core/network/dalil_error_catalog.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/features/settings/bloc/delete_account_bloc.dart';

class DeleteAccountButton extends StatelessWidget {
  const DeleteAccountButton({this.bloc, super.key});

  final DeleteAccountBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<DeleteAccountBloc>.value(
        value: bloc!,
        child: const _DeleteAccountControl(),
      );
    }
    if (!getIt.isRegistered<DeleteAccountBloc>()) {
      return const SizedBox.shrink();
    }
    return BlocProvider<DeleteAccountBloc>(
      create: (BuildContext context) => getIt<DeleteAccountBloc>(),
      child: const _DeleteAccountControl(),
    );
  }
}

class _DeleteAccountControl extends StatelessWidget {
  const _DeleteAccountControl();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final String language = Localizations.localeOf(context).languageCode;
    return BlocBuilder<DeleteAccountBloc, DeleteAccountState>(
      builder: (BuildContext context, DeleteAccountState state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const SizedBox(height: 12),
            AppButton(
              label: l10n.deleteAccount,
              onPressed: () {
                context.read<DeleteAccountBloc>().add(
                  const DeleteAccountRequested(),
                );
              },
            ),
            if (state.isDeleted)
              Text(l10n.accountDeleted, key: const Key('account-deleted')),
            if (state.errorCode != null)
              Text(dalilErrorText(state.errorCode!, language)),
          ],
        );
      },
    );
  }
}
