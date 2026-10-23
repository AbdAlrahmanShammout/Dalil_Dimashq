import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/claim_place_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_place_search_bloc.dart';
import 'package:dalil_dimashq/presentation/features/owner/pages/claim_place_page.dart';

class OwnerPlaceSearch extends StatefulWidget {
  const OwnerPlaceSearch({this.bloc, super.key});

  final OwnerPlaceSearchBloc? bloc;

  @override
  State<OwnerPlaceSearch> createState() => _OwnerPlaceSearchState();
}

class _OwnerPlaceSearchState extends State<OwnerPlaceSearch> {
  final TextEditingController _name = TextEditingController();

  @override
  void dispose() {
    _name.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.bloc == null && !getIt.isRegistered<OwnerPlaceSearchBloc>()) {
      return const SizedBox.shrink();
    }
    final OwnerPlaceSearchBloc resolved =
        widget.bloc ?? getIt<OwnerPlaceSearchBloc>();
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<OwnerPlaceSearchBloc>.value(
      value: resolved,
      child: BlocBuilder<OwnerPlaceSearchBloc, OwnerPlaceSearchState>(
        builder: (BuildContext context, OwnerPlaceSearchState state) {
          return Column(
            children: <Widget>[
              TextField(
                key: const Key('owner-name-search'),
                controller: _name,
                decoration: InputDecoration(hintText: l10n.searchPlaces),
              ),
              AppButton(
                key: const Key('owner-name-submit'),
                label: l10n.searchPlaces,
                onPressed: () => resolved.add(
                  OwnerPlaceSearchRequested(_name.text),
                ),
              ),
              ...state.places.map(
                (place) => ListTile(
                  key: Key('found-${place.id}'),
                  title: Text(place.nameAr),
                  onTap: () {
                    if (!getIt.isRegistered<ClaimPlaceBloc>()) {
                      return;
                    }
                    Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (BuildContext context) => ClaimPlacePage(
                          placeId: place.id,
                          bloc: getIt<ClaimPlaceBloc>(),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
