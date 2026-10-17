import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

class PlaceContactSection extends StatelessWidget {
  const PlaceContactSection({
    required this.place,
    required this.links,
    super.key,
  });

  final PlaceDetail place;
  final PlaceLinks links;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final List<Widget> rows = <Widget>[
      for (final String phone in place.phones)
        _ContactRow(label: l10n.call, value: phone, onTap: () => links.call(phone)),
      if (_present(place.website))
        _ContactRow(
          label: l10n.website,
          value: place.website!,
          onTap: () => links.openUrl(Uri.parse(place.website!)),
        ),
      if (_present(place.facebook))
        _ContactRow(
          label: l10n.facebook,
          value: place.facebook!,
          onTap: () => links.openUrl(Uri.parse(place.facebook!)),
        ),
      if (_present(place.instagram))
        _ContactRow(
          label: l10n.instagram,
          value: place.instagram!,
          onTap: () => links.openUrl(Uri.parse(place.instagram!)),
        ),
      if (_present(place.email))
        _ContactRow(
          label: l10n.email,
          value: place.email!,
          onTap: () => links.openUrl(Uri.parse('mailto:${place.email}')),
        ),
    ];
    if (rows.isEmpty) {
      return const SizedBox.shrink();
    }
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(l10n.contact, style: Theme.of(context).textTheme.titleMedium),
          ...rows,
        ],
      ),
    );
  }

  bool _present(String? value) => value != null && value.isNotEmpty;
}

class _ContactRow extends StatelessWidget {
  const _ContactRow({
    required this.label,
    required this.value,
    required this.onTap,
  });

  final String label;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(label),
      subtitle: Text(value),
      onTap: onTap,
    );
  }
}
