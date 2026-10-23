import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/suggestion.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/suggestion/bloc/suggestion_bloc.dart';

class SuggestionPage extends StatelessWidget {
  const SuggestionPage({this.bloc, super.key});

  final SuggestionBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<SuggestionBloc>.value(
        value: bloc!,
        child: const _SuggestionForm(),
      );
    }
    return BlocProvider<SuggestionBloc>(
      create: (BuildContext context) => getIt<SuggestionBloc>(),
      child: const _SuggestionForm(),
    );
  }
}

class _SuggestionForm extends StatefulWidget {
  const _SuggestionForm();

  @override
  State<_SuggestionForm> createState() => _SuggestionFormState();
}

class _SuggestionFormState extends State<_SuggestionForm> {
  final TextEditingController _name = TextEditingController();
  final TextEditingController _contact = TextEditingController();
  final TextEditingController _message = TextEditingController();
  final TextEditingController _place = TextEditingController();

  @override
  void dispose() {
    _name.dispose();
    _contact.dispose();
    _message.dispose();
    _place.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isWaitingForKinds = Suggestion.kinds.isEmpty;
    return AppScaffold(
      title: l10n.suggestion,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: BlocBuilder<SuggestionBloc, SuggestionState>(
          builder: (BuildContext context, SuggestionState state) {
            return ListView(
              children: <Widget>[
                if (isWaitingForKinds || state.isWaiting)
                  Text(
                    l10n.suggestionKindPending,
                    key: const Key('suggestion-waiting'),
                  ),
                TextField(
                  key: const Key('suggestion-name'),
                  controller: _name,
                  decoration: InputDecoration(labelText: l10n.displayName),
                ),
                TextField(
                  key: const Key('suggestion-contact'),
                  controller: _contact,
                  decoration: InputDecoration(labelText: l10n.contactValue),
                ),
                TextField(
                  key: const Key('suggestion-place'),
                  controller: _place,
                  decoration: InputDecoration(labelText: l10n.optionalPlace),
                ),
                TextField(
                  key: const Key('suggestion-message'),
                  controller: _message,
                  decoration: InputDecoration(labelText: l10n.message),
                ),
                const SizedBox(height: 12),
                AppButton(
                  label: l10n.send,
                  onPressed: isWaitingForKinds
                      ? null
                      : () {
                          context.read<SuggestionBloc>().add(
                            SuggestionSubmitted(
                              Suggestion(
                                name: _name.text,
                                contact: _contact.text,
                                message: _message.text,
                                placeId: _place.text,
                              ),
                            ),
                          );
                        },
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
