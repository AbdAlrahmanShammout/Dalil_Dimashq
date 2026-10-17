import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_event.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_state.dart';

class CategoryChips extends StatelessWidget {
  const CategoryChips({super.key});

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocBuilder<ExploreBloc, ExploreState>(
      builder: (BuildContext context, ExploreState state) {
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: <Widget>[
              _Chip(
                label: '${l10n.categoryAll} ${state.counts.all}',
                selected: state.category == PlaceCategory.all,
                onTap: () => context.read<ExploreBloc>().add(
                  const ExploreCategorySelected(PlaceCategory.all),
                ),
              ),
              _Chip(
                label: '${l10n.categoryHotels} ${state.counts.hotels}',
                selected: state.category == PlaceCategory.hotels,
                onTap: () => context.read<ExploreBloc>().add(
                  const ExploreCategorySelected(PlaceCategory.hotels),
                ),
              ),
              _Chip(
                label:
                    '${l10n.categoryRestaurants} ${state.counts.restaurants}',
                selected: state.category == PlaceCategory.restaurants,
                onTap: () => context.read<ExploreBloc>().add(
                  const ExploreCategorySelected(PlaceCategory.restaurants),
                ),
              ),
              _Chip(
                label: '${l10n.categoryCafes} ${state.counts.cafes}',
                selected: state.category == PlaceCategory.cafes,
                onTap: () => context.read<ExploreBloc>().add(
                  const ExploreCategorySelected(PlaceCategory.cafes),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label),
        selected: selected,
        onSelected: (_) => onTap(),
      ),
    );
  }
}
