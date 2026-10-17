import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_bloc.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_event.dart';
import 'package:dalil_dimashq/presentation/features/auth/bloc/recovery_state.dart';

class RecoveryPage extends StatelessWidget {
  const RecoveryPage({this.bloc, super.key});

  final RecoveryBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<RecoveryBloc>.value(
        value: bloc!,
        child: const _RecoveryForm(),
      );
    }
    return BlocProvider<RecoveryBloc>(
      create: (BuildContext context) => getIt<RecoveryBloc>(),
      child: const _RecoveryForm(),
    );
  }
}

class _RecoveryForm extends StatefulWidget {
  const _RecoveryForm();

  @override
  State<_RecoveryForm> createState() => _RecoveryFormState();
}

class _RecoveryFormState extends State<_RecoveryForm> {
  final TextEditingController _email = TextEditingController();

  @override
  void dispose() {
    _email.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.forgotPassword,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: <Widget>[
            TextField(
              key: const Key('recovery-email'),
              controller: _email,
              decoration: InputDecoration(labelText: l10n.email),
            ),
            const SizedBox(height: 16),
            AppButton(
              label: l10n.sendRecovery,
              onPressed: () {
                context.read<RecoveryBloc>().add(
                  RecoverySubmitted(_email.text),
                );
              },
            ),
            const SizedBox(height: 16),
            BlocBuilder<RecoveryBloc, RecoveryState>(
              builder: (BuildContext context, RecoveryState state) {
                final String message = state.status == RecoveryStatus.success
                    ? l10n.recoverySent
                    : '';
                return Text(message, key: const Key('recovery-message'));
              },
            ),
          ],
        ),
      ),
    );
  }
}
