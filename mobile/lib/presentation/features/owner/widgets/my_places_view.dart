import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/my_places_bloc.dart';

class MyPlacesView extends StatelessWidget {
  const MyPlacesView({this.bloc, super.key});

  final MyPlacesBloc? bloc;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    if (bloc == null && !getIt.isRegistered<MyPlacesBloc>()) {
      return Center(child: Text(l10n.myPlaces));
    }
    final MyPlacesBloc resolved = bloc ?? getIt<MyPlacesBloc>();
    return BlocProvider<MyPlacesBloc>.value(
      value: resolved..add(const MyPlacesStarted()),
      child: BlocBuilder<MyPlacesBloc, MyPlacesState>(
        builder: (BuildContext context, MyPlacesState state) {
          return ListView(
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.all(16),
                child: Text(l10n.myPlaces),
              ),
              ...state.places.map(
                (place) => ListTile(
                  key: Key('owned-${place.id}'),
                  title: Text(place.nameAr),
                  subtitle: Text(
                    '${place.type}${place.address == null ? '' : ' · ${place.address}'}',
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
