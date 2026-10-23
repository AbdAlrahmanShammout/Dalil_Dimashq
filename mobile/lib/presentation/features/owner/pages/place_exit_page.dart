import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/usecase/request_place_exit_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';

class PlaceExitPage extends StatefulWidget {
  const PlaceExitPage({required this.placeId, required this.exit, super.key});

  final String placeId;
  final RequestPlaceExitUseCase exit;

  @override
  State<PlaceExitPage> createState() => _PlaceExitPageState();
}

class _PlaceExitPageState extends State<PlaceExitPage> {
  final TextEditingController _reason = TextEditingController();
  bool _isSent = false;

  @override
  void dispose() {
    _reason.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.removePlace,
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: <Widget>[
          TextField(
            key: const Key('exit-reason'),
            controller: _reason,
            decoration: InputDecoration(labelText: l10n.exitReason),
          ),
          AppButton(
            key: const Key('request-removal'),
            label: l10n.removePlace,
            onPressed: () async {
              final result = await widget.exit.remove(
                placeId: widget.placeId,
                reason: _reason.text,
              );
              if (result.isRight()) {
                setState(() => _isSent = true);
              }
            },
          ),
          AppButton(
            key: const Key('request-unlink'),
            label: l10n.unlinkPlace,
            onPressed: () async {
              final result = await widget.exit.unlink(
                placeId: widget.placeId,
                reason: _reason.text,
              );
              if (result.isRight()) {
                setState(() => _isSent = true);
              }
            },
          ),
          if (_isSent) Text(l10n.exitSent, key: const Key('exit-sent')),
        ],
      ),
    );
  }
}
