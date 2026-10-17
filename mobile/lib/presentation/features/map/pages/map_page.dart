import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/place_summary.dart';
import 'package:dalil_dimashq/presentation/features/map/bloc/map_bloc.dart';
import 'package:dalil_dimashq/presentation/features/map/widgets/cluster_map.dart';

class MapPage extends StatelessWidget {
  const MapPage({this.places, this.mapBloc, this.center, super.key});

  final List<PlaceSummary>? places;
  final MapBloc? mapBloc;
  final String? center;

  @override
  Widget build(BuildContext context) {
    if (places != null) {
      return ClusterMap(places: places!, center: center);
    }
    final MapBloc bloc = mapBloc ?? getIt<MapBloc>();
    return BlocProvider<MapBloc>.value(
      value: bloc..add(const MapStarted()),
      child: BlocBuilder<MapBloc, MapState>(
        builder: (BuildContext context, MapState state) {
          return ClusterMap(places: state.places, center: center);
        },
      ),
    );
  }
}
