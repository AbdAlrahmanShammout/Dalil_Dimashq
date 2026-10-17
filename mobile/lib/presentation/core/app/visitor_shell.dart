import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_event.dart';
import 'package:dalil_dimashq/presentation/features/explore/widgets/category_chips.dart';
import 'package:dalil_dimashq/presentation/features/explore/widgets/featured_strip.dart';
import 'package:dalil_dimashq/presentation/features/explore/widgets/filters_sheet.dart';
import 'package:dalil_dimashq/presentation/features/events/pages/events_page.dart';
import 'package:dalil_dimashq/presentation/features/map/pages/map_page.dart';
import 'package:dalil_dimashq/presentation/features/explore/widgets/explore_search_bar.dart';
import 'package:dalil_dimashq/presentation/features/explore/widgets/explore_view_switch.dart';
import 'package:dalil_dimashq/presentation/features/offers/pages/offers_page.dart';
import 'package:dalil_dimashq/domain/usecase/has_session_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/auth/pages/sign_in_page.dart';
import 'package:dalil_dimashq/presentation/features/auth/pages/sign_up_page.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/owner_gate_page.dart';
import 'package:dalil_dimashq/presentation/features/profile/pages/profile_page.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_section.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_bloc.dart';
import 'package:dalil_dimashq/presentation/features/language/bloc/language_event.dart';

class VisitorShell extends StatefulWidget {
  const VisitorShell({this.exploreBloc, super.key});

  final ExploreBloc? exploreBloc;

  @override
  State<VisitorShell> createState() => _VisitorShellState();
}

class _VisitorShellState extends State<VisitorShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final List<Widget> pages = <Widget>[
      widget.exploreBloc == null
          ? BlocProvider<ExploreBloc>(
              create: (BuildContext context) =>
                  getIt<ExploreBloc>()..add(const ExploreStarted()),
              child: const _ExploreBody(),
            )
          : BlocProvider<ExploreBloc>.value(
              value: widget.exploreBloc!..add(const ExploreStarted()),
              child: const _ExploreBody(),
            ),
      const MapPage(),
      const EventsPage(),
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

class _ExploreBody extends StatelessWidget {
  const _ExploreBody();

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: <Widget>[
        Padding(padding: EdgeInsets.all(16), child: ExploreSearchBar()),
        FiltersButton(),
        OffersEntry(),
        CategoryChips(),
        FeaturedStrip(),
        Expanded(child: ExploreViewSwitch()),
      ],
    );
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
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppButton(
              label: isArabic ? l10n.english : l10n.arabic,
              onPressed: () {
                context.read<LanguageBloc>().add(
                  LanguageSelected(
                    isArabic ? englishLanguageCode : arabicLanguageCode,
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            AppButton(
              label: l10n.signUp,
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) => const SignUpPage(),
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            AppButton(
              label: l10n.signIn,
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) => const SignInPage(),
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            AppButton(
              label: l10n.profile,
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) => const ProfilePage(),
                  ),
                );
              },
            ),
            const SizedBox(height: 12),
            AppButton(
              label: l10n.owner,
              onPressed: () {
                final bool hasSession = getIt<HasSessionUseCase>()();
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) =>
                        OwnerGatePage(hasSession: hasSession),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
