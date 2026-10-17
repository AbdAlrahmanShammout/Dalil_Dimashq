import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_bloc.dart';
import 'package:dalil_dimashq/presentation/features/explore/bloc/explore_state.dart';
import 'package:dalil_dimashq/presentation/features/explore/widgets/explore_search_bar.dart';
import 'package:dalil_dimashq/presentation/features/map/widgets/cluster_map.dart';

class ExploreViewSwitch extends StatefulWidget {
  const ExploreViewSwitch({super.key});

  @override
  State<ExploreViewSwitch> createState() => _ExploreViewSwitchState();
}

class _ExploreViewSwitchState extends State<ExploreViewSwitch> {
  bool _showMap = false;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return Column(
      children: <Widget>[
        Align(
          alignment: AlignmentDirectional.centerStart,
          child: TextButton(
            key: const Key('list-map-switch'),
            onPressed: () => setState(() => _showMap = !_showMap),
            child: Text(_showMap ? l10n.explore : l10n.map),
          ),
        ),
        Expanded(
          child: _showMap
              ? BlocBuilder<ExploreBloc, ExploreState>(
                  builder: (BuildContext context, ExploreState state) {
                    return ClusterMap(places: state.places);
                  },
                )
              : const ExploreResults(),
        ),
      ],
    );
  }
}
