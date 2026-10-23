import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/core/network/dalil_error_catalog.dart';
import 'package:dalil_dimashq/domain/entities/legal_document.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/legal/bloc/legal_bloc.dart';
import 'package:dalil_dimashq/presentation/features/legal/bloc/legal_event.dart';
import 'package:dalil_dimashq/presentation/features/legal/bloc/legal_state.dart';

class LegalPage extends StatelessWidget {
  const LegalPage({this.bloc, super.key});

  final LegalBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<LegalBloc>.value(
        value: bloc!..add(const LegalStarted()),
        child: const _LegalBody(),
      );
    }
    return BlocProvider<LegalBloc>(
      create: (BuildContext context) =>
          getIt<LegalBloc>()..add(const LegalStarted()),
      child: const _LegalBody(),
    );
  }
}

class _LegalBody extends StatelessWidget {
  const _LegalBody();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    return AppScaffold(
      title: l10n.termsAndPrivacy,
      body: BlocBuilder<LegalBloc, LegalState>(
        builder: (BuildContext context, LegalState state) {
          if (state.documents.isEmpty && state.errorCode == null) {
            return Center(child: Text(l10n.legalUpToDate));
          }
          return ListView(
            padding: const EdgeInsets.all(16),
            children: <Widget>[
              if (state.errorCode != null)
                Text(
                  dalilErrorText(
                    state.errorCode!,
                    isArabic ? 'ar' : 'en',
                  ),
                ),
              for (final LegalDocument document in state.documents)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      document.kind == 'terms' ? l10n.terms : l10n.privacy,
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      isArabic ? document.bodyAr : document.bodyEn,
                      key: Key('legal-${document.id}'),
                    ),
                    const SizedBox(height: 12),
                    AppButton(
                      label: l10n.accept,
                      onPressed: () {
                        context.read<LegalBloc>().add(
                          LegalAccepted(document.id),
                        );
                      },
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
            ],
          );
        },
      ),
    );
  }
}
