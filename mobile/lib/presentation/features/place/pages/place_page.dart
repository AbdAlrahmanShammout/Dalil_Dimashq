import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/core/widgets/error_view.dart';
import 'package:dalil_dimashq/presentation/core/widgets/loading_view.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_event.dart';
import 'package:dalil_dimashq/presentation/features/place/bloc/place_state.dart';
import 'package:dalil_dimashq/presentation/features/place/widgets/place_actions.dart';
import 'package:dalil_dimashq/presentation/features/place/widgets/place_header.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';

class PlacePage extends StatelessWidget {
  const PlacePage({
    required this.placeId,
    this.placeBloc,
    this.links,
    super.key,
  });

  final String placeId;
  final PlaceBloc? placeBloc;
  final PlaceLinks? links;

  @override
  Widget build(BuildContext context) {
    final PlaceBloc bloc = placeBloc ?? getIt<PlaceBloc>();
    final PlaceLinks resolvedLinks = links ?? getIt<PlaceLinks>();
    return BlocProvider<PlaceBloc>.value(
      value: bloc..add(PlaceRequested(placeId)),
      child: _PlaceView(placeId: placeId, links: resolvedLinks),
    );
  }
}

class _PlaceView extends StatelessWidget {
  const _PlaceView({required this.placeId, required this.links});

  final String placeId;
  final PlaceLinks links;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.appTitle,
      body: BlocBuilder<PlaceBloc, PlaceState>(
        builder: (BuildContext context, PlaceState state) {
          if (state.isLoading && state.place == null) {
            return const LoadingView();
          }
          if (state.errorMessage != null && state.place == null) {
            return ErrorView(
              message: state.errorMessage!,
              retryLabel: l10n.retry,
              onRetry: () =>
                  context.read<PlaceBloc>().add(PlaceRequested(placeId)),
            );
          }
          if (state.place == null) {
            return const LoadingView();
          }
          return ListView(
            children: <Widget>[
              PlaceHeader(place: state.place!),
              PlaceActions(place: state.place!, links: links),
            ],
          );
        },
      ),
    );
  }
}
