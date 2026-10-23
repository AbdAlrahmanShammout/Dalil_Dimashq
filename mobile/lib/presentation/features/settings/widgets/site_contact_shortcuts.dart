import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/site_contact.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/features/settings/bloc/site_contacts_bloc.dart';

class SiteContactShortcuts extends StatelessWidget {
  const SiteContactShortcuts({this.bloc, this.links, super.key});

  final SiteContactsBloc? bloc;
  final PlaceLinks? links;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<SiteContactsBloc>.value(
        value: bloc!..add(const SiteContactsStarted()),
        child: _ShortcutList(links: links),
      );
    }
    if (!getIt.isRegistered<SiteContactsBloc>()) {
      return const SizedBox.shrink();
    }
    return BlocProvider<SiteContactsBloc>(
      create: (BuildContext context) =>
          getIt<SiteContactsBloc>()..add(const SiteContactsStarted()),
      child: _ShortcutList(links: links),
    );
  }
}

class _ShortcutList extends StatelessWidget {
  const _ShortcutList({this.links});

  final PlaceLinks? links;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocBuilder<SiteContactsBloc, SiteContactsState>(
      builder: (BuildContext context, SiteContactsState state) {
        final List<SiteContact> visible = state.contacts
            .where((SiteContact contact) => contact.isVisible)
            .toList();
        if (visible.isEmpty) {
          return const SizedBox.shrink();
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const SizedBox(height: 12),
            Text(l10n.contactChannels),
            for (final SiteContact contact in visible)
              AppButton(
                label: _label(l10n, contact.key),
                onPressed: () {
                  final PlaceLinks? opener =
                      links ??
                      (getIt.isRegistered<PlaceLinks>()
                          ? getIt<PlaceLinks>()
                          : null);
                  final Uri? uri = contactUri(contact);
                  if (opener != null && uri != null) {
                    opener.openUrl(uri);
                  }
                },
              ),
          ],
        );
      },
    );
  }

  String _label(AppLocalizations l10n, String key) {
    switch (key.toLowerCase()) {
      case 'whatsapp':
        return l10n.whatsapp;
      case 'phone':
        return l10n.phone;
      case 'email':
        return l10n.email;
      case 'facebook':
        return l10n.facebook;
      case 'instagram':
        return l10n.instagram;
      default:
        return key;
    }
  }
}

Uri? contactUri(SiteContact contact) {
  final String value = contact.value.trim();
  if (value.isEmpty) {
    return null;
  }
  switch (contact.key.toLowerCase()) {
    case 'phone':
      return Uri.parse('tel:$value');
    case 'email':
      return Uri.parse('mailto:$value');
    case 'whatsapp':
      if (value.startsWith('http')) {
        return Uri.parse(value);
      }
      final String digits = value.replaceAll(RegExp(r'\D'), '');
      return Uri.parse('https://wa.me/$digits');
    default:
      if (value.startsWith('http')) {
        return Uri.parse(value);
      }
      return Uri.parse('https://$value');
  }
}
