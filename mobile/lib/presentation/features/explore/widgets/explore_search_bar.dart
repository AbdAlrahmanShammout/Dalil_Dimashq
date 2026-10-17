import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_event.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_state.dart';
import 'package:dalil_dimashq/presentation/features/explore/widgets/place_card.dart';

class ExploreSearchBar extends StatefulWidget {
  const ExploreSearchBar({super.key});

  @override
  State<ExploreSearchBar> createState() => _ExploreSearchBarState();
}

class _ExploreSearchBarState extends State<ExploreSearchBar> {
  Timer? _debounce;

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        hintText: AppLocalizations.of(context).searchHint,
        prefixIcon: const Icon(Icons.search),
      ),
      onChanged: (String value) {
        _debounce?.cancel();
        _debounce = Timer(const Duration(milliseconds: 300), () {
          context.read<ExploreBloc>().add(ExploreQueryChanged(value));
        });
      },
    );
  }
}

class ExploreResults extends StatelessWidget {
  const ExploreResults({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ExploreBloc, ExploreState>(
      builder: (BuildContext context, ExploreState state) {
        return ListView(
          children: state.places
              .map((place) => PlaceCard(place: place))
              .toList(),
        );
      },
    );
  }
}
