import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/amenity.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_amenities_bloc.dart';

class OwnerAmenitiesPage extends StatelessWidget {
  const OwnerAmenitiesPage({
    required this.placeId,
    required this.bloc,
    super.key,
  });

  final String placeId;
  final OwnerAmenitiesBloc bloc;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<OwnerAmenitiesBloc>.value(
      value: bloc..add(OwnerAmenitiesStarted(placeId)),
      child: AppScaffold(
        title: l10n.ownerAmenities,
        body: BlocBuilder<OwnerAmenitiesBloc, OwnerAmenitiesState>(
          builder: (BuildContext context, OwnerAmenitiesState state) {
            return ListView(
              children: state.amenities.catalog.map((Amenity amenity) {
                final bool isSelected = state.amenities.has(amenity.code);
                return CheckboxListTile(
                  key: Key('amenity-${amenity.code}'),
                  value: isSelected,
                  title: Text(amenity.nameEn),
                  onChanged: (bool? value) => bloc.add(
                    OwnerAmenityToggled(placeId: placeId, code: amenity.code),
                  ),
                );
              }).toList(growable: false),
            );
          },
        ),
      ),
    );
  }
}
