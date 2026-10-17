import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_section.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_event.dart';

class VisitorShell extends StatefulWidget {
  const VisitorShell({super.key});

  @override
  State<VisitorShell> createState() => _VisitorShellState();
}

class _VisitorShellState extends State<VisitorShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final List<Widget> pages = <Widget>[
      _EmptyTab(title: l10n.explore),
      _EmptyTab(title: l10n.map),
      _EmptyTab(title: l10n.events),
      const _AccountTab(),
    ];
    return AppScaffold(
      title: l10n.appTitle,
      body: pages[_index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (int index) => setState(() => _index = index),
        destinations: <NavigationDestination>[
          NavigationDestination(
            icon: const Icon(Icons.search),
            label: l10n.explore,
          ),
          NavigationDestination(icon: const Icon(Icons.map), label: l10n.map),
          NavigationDestination(
            icon: const Icon(Icons.event),
            label: l10n.events,
          ),
          NavigationDestination(
            icon: const Icon(Icons.person),
            label: l10n.account,
          ),
        ],
      ),
    );
  }
}

class _EmptyTab extends StatelessWidget {
  const _EmptyTab({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Center(child: Text(title));
  }
}

class _AccountTab extends StatelessWidget {
  const _AccountTab();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final bool isArabic = Localizations.localeOf(context).languageCode == 'ar';
    return Padding(
      padding: const EdgeInsets.all(16),
      child: AppSection(
        title: l10n.language,
        child: AppButton(
          label: isArabic ? l10n.english : l10n.arabic,
          onPressed: () {
            context.read<LanguageBloc>().add(
              LanguageSelected(
                isArabic ? englishLanguageCode : arabicLanguageCode,
              ),
            );
          },
        ),
      ),
    );
  }
}
