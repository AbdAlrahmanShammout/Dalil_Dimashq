import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_photo_bloc.dart';

class PlacePhotosPage extends StatelessWidget {
  const PlacePhotosPage({
    required this.isPremium,
    required this.bloc,
    super.key,
  });

  final bool isPremium;
  final PlacePhotoBloc bloc;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<PlacePhotoBloc>.value(
      value: bloc..add(PlacePhotoStarted(isPremium)),
      child: AppScaffold(
        title: l10n.ownerPhotos,
        body: BlocBuilder<PlacePhotoBloc, PlacePhotoState>(
          builder: (BuildContext context, PlacePhotoState state) {
            if (!state.isPremium) {
              return const SizedBox.shrink();
            }
            return ListView(
              children: <Widget>[
                AppButton(
                  key: const Key('pick-camera'),
                  label: l10n.takePhoto,
                  onPressed: () => bloc.add(
                    const PlacePhotoPickRequested(PhotoOrigin.camera),
                  ),
                ),
                AppButton(
                  key: const Key('pick-gallery'),
                  label: l10n.choosePhoto,
                  onPressed: () => bloc.add(
                    const PlacePhotoPickRequested(PhotoOrigin.gallery),
                  ),
                ),
                if (state.photo != null)
                  Text(state.photo!.name, key: const Key('picked-photo')),
              ],
            );
          },
        ),
      ),
    );
  }
}
