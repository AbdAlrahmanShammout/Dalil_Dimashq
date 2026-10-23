import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/claim_place_bloc.dart';

class ClaimPlacePage extends StatefulWidget {
  const ClaimPlacePage({required this.placeId, required this.bloc, super.key});

  final String placeId;
  final ClaimPlaceBloc bloc;

  @override
  State<ClaimPlacePage> createState() => _ClaimPlacePageState();
}

class _ClaimPlacePageState extends State<ClaimPlacePage> {
  final TextEditingController _code = TextEditingController();

  @override
  void dispose() {
    _code.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<ClaimPlaceBloc>.value(
      value: widget.bloc,
      child: AppScaffold(
        title: l10n.linkWithCode,
        body: BlocBuilder<ClaimPlaceBloc, ClaimPlaceState>(
          builder: (BuildContext context, ClaimPlaceState state) {
            return ListView(
              padding: const EdgeInsets.all(16),
              children: <Widget>[
                TextField(
                  key: const Key('place-code'),
                  controller: _code,
                  decoration: InputDecoration(labelText: l10n.placeCode),
                ),
                AppButton(
                  key: const Key('claim-with-code'),
                  label: l10n.linkWithCode,
                  onPressed: () => widget.bloc.add(
                    ClaimPlaceSubmitted(
                      placeId: widget.placeId,
                      code: _code.text,
                    ),
                  ),
                ),
                if (state.isLinked)
                  Text(l10n.placeLinked, key: const Key('place-linked')),
                if (state.errorCode != null)
                  Text(l10n.invalidCode, key: const Key('invalid-code')),
              ],
            );
          },
        ),
      ),
    );
  }
}
