import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/theme/app_colors.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_state.dart';

class FeaturedStrip extends StatelessWidget {
  const FeaturedStrip({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ExploreBloc, ExploreState>(
      builder: (BuildContext context, ExploreState state) {
        final List<PlaceSummary> featured = state.places
            .where((PlaceSummary place) => place.isFeatured)
            .toList();
        if (featured.isEmpty) {
          return const SizedBox.shrink();
        }
        final AppLocalizations l10n = AppLocalizations.of(context);
        return SizedBox(
          height: 88,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: featured.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (BuildContext context, int index) {
              final PlaceSummary place = featured[index];
              return Chip(
                avatar: const Icon(Icons.star, color: AppColors.gold, size: 16),
                label: Text('${place.nameAr} · ${l10n.featured}'),
              );
            },
          ),
        );
      },
    );
  }
}
