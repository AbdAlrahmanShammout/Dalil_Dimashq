import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/site_contact.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/site_contact_repository.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:dalil_dimashq/domain/usecase/load_site_contacts_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/settings/bloc/site_contacts_bloc.dart';
import 'package:dalil_dimashq/presentation/features/settings/widgets/site_contact_shortcuts.dart';

void main() {
  testWidgets('empty contact values stay hidden and a link opens', (
    WidgetTester tester,
  ) async {
    final _RecordingLinks links = _RecordingLinks();
    await tester.pumpWidget(
      MaterialApp(
        locale: const Locale('en'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: SiteContactShortcuts(
            links: links,
            bloc: SiteContactsBloc(
              LoadSiteContactsUseCase(_Contacts()),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.text('Email'), findsNothing);
    expect(find.text('WhatsApp'), findsOneWidget);
    await tester.tap(find.text('WhatsApp'));
    await tester.pump();
    expect(links.opened.toString(), 'https://wa.me/963944000000');
  });
}

class _Contacts implements SiteContactRepository {
  @override
  Future<Either<Failure, List<SiteContact>>> load() async {
    return const Right(<SiteContact>[
      SiteContact(key: 'email', value: ''),
      SiteContact(key: 'whatsapp', value: 'https://wa.me/963944000000'),
    ]);
  }
}

class _RecordingLinks implements PlaceLinks {
  Uri? opened;

  @override
  Future<void> call(String phone) async {}

  @override
  Future<void> copyPhone(String phone) async {}

  @override
  Future<void> openDirections({
    required double latitude,
    required double longitude,
  }) async {}

  @override
  Future<void> openUrl(Uri uri) async {
    opened = uri;
  }

  @override
  Future<void> share(String text) async {}
}
