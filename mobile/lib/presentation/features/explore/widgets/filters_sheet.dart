import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/place_enums.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_event.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_state.dart';

class FiltersButton extends StatelessWidget {
  const FiltersButton({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ExploreBloc, ExploreState>(
      builder: (BuildContext context, ExploreState state) {
        final AppLocalizations l10n = AppLocalizations.of(context);
        return Align(
          alignment: AlignmentDirectional.centerStart,
          child: TextButton(
            key: const Key('filters-open'),
            onPressed: () => _openSheet(context, state),
            child: Text('${l10n.filters} (${state.activeFilterCount})'),
          ),
        );
      },
    );
  }

  Future<void> _openSheet(BuildContext context, ExploreState state) {
    final ExploreBloc bloc = context.read<ExploreBloc>();
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (BuildContext _) {
        return BlocProvider<ExploreBloc>.value(
          value: bloc,
          child: FiltersSheet(initial: state),
        );
      },
    );
  }
}

class FiltersSheet extends StatefulWidget {
  const FiltersSheet({required this.initial, super.key});

  final ExploreState initial;

  @override
  State<FiltersSheet> createState() => _FiltersSheetState();
}

class _FiltersSheetState extends State<FiltersSheet> {
  late PlaceCategory _category = widget.initial.category;
  late int? _areaId = widget.initial.areaId;
  late int? _minStars = widget.initial.minStars;
  late bool _hasPhone = widget.initial.hasPhone;
  late PlaceSort _sort = widget.initial.sort;
  String _areaQuery = '';

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final List<Area> areas = _matchingAreas();
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: <Widget>[
          Text(l10n.filters, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          _ChoiceRow(
            labels: <String, PlaceCategory>{
              l10n.categoryAll: PlaceCategory.all,
              l10n.categoryHotels: PlaceCategory.hotels,
              l10n.categoryRestaurants: PlaceCategory.restaurants,
              l10n.categoryCafes: PlaceCategory.cafes,
            },
            selected: _category,
            onSelected: (PlaceCategory value) =>
                setState(() => _category = value),
            keyFor: (PlaceCategory value) =>
                Key('filter-category-${value.name}'),
          ),
          const SizedBox(height: 12),
          Text(l10n.minStars),
          _StarChoices(
            anyLabel: l10n.anyStars,
            selected: _minStars,
            onSelected: (int? value) => setState(() => _minStars = value),
          ),
          const SizedBox(height: 12),
          Text(l10n.area),
          TextField(
            key: const Key('filter-area-search'),
            decoration: InputDecoration(hintText: l10n.area),
            onChanged: (String value) => setState(() => _areaQuery = value),
          ),
          ...areas.map(
            (Area area) => ListTile(
              key: Key('filter-area-${area.id}'),
              title: Text(area.nameEn),
              selected: _areaId == area.id,
              onTap: () => setState(() => _areaId = area.id),
            ),
          ),
          SwitchListTile(
            key: const Key('filter-has-phone'),
            contentPadding: EdgeInsets.zero,
            title: Text(l10n.hasPhone),
            value: _hasPhone,
            onChanged: (bool value) => setState(() => _hasPhone = value),
          ),
          Text(l10n.sortLabel),
          _ChoiceRow(
            labels: <String, PlaceSort>{
              l10n.sortCompleteness: PlaceSort.completeness,
              l10n.sortRating: PlaceSort.rating,
              l10n.sortName: PlaceSort.name,
            },
            selected: _sort,
            onSelected: (PlaceSort value) => setState(() => _sort = value),
            keyFor: (PlaceSort value) => Key('filter-sort-${value.name}'),
          ),
          const SizedBox(height: 16),
          Row(
            children: <Widget>[
              TextButton(
                key: const Key('filter-clear'),
                onPressed: _clear,
                child: Text(l10n.clearFilters),
              ),
              const Spacer(),
              FilledButton(
                key: const Key('filter-apply'),
                onPressed: _apply,
                child: Text(l10n.applyFilters),
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<Area> _matchingAreas() {
    final String query = _areaQuery.trim().toLowerCase();
    if (query.isEmpty) {
      return widget.initial.areas;
    }
    return widget.initial.areas.where((Area area) {
      return area.nameAr.toLowerCase().contains(query) ||
          area.nameEn.toLowerCase().contains(query);
    }).toList();
  }

  void _apply() {
    context.read<ExploreBloc>().add(
      ExploreFiltersApplied(
        category: _category,
        areaId: _areaId,
        minStars: _minStars,
        hasPhone: _hasPhone,
        sort: _sort,
      ),
    );
    Navigator.pop(context);
  }

  void _clear() {
    context.read<ExploreBloc>().add(
      const ExploreFiltersApplied(category: PlaceCategory.all),
    );
    Navigator.pop(context);
  }
}

class _StarChoices extends StatelessWidget {
  const _StarChoices({
    required this.anyLabel,
    required this.selected,
    required this.onSelected,
  });

  final String anyLabel;
  final int? selected;
  final ValueChanged<int?> onSelected;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      children: <Widget>[
        ChoiceChip(
          label: Text(anyLabel),
          selected: selected == null,
          onSelected: (_) => onSelected(null),
        ),
        for (var stars = 1; stars <= 5; stars++)
          ChoiceChip(
            key: Key('filter-stars-$stars'),
            label: Text('$stars'),
            selected: selected == stars,
            onSelected: (_) => onSelected(stars),
          ),
      ],
    );
  }
}

class _ChoiceRow<T> extends StatelessWidget {
  const _ChoiceRow({
    required this.labels,
    required this.selected,
    required this.onSelected,
    required this.keyFor,
  });

  final Map<String, T> labels;
  final T selected;
  final ValueChanged<T> onSelected;
  final Key Function(T value) keyFor;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      children: labels.entries.map((MapEntry<String, T> entry) {
        return ChoiceChip(
          key: keyFor(entry.value),
          label: Text(entry.key),
          selected: selected == entry.value,
          onSelected: (_) => onSelected(entry.value),
        );
      }).toList(),
    );
  }
}
