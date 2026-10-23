import 'package:flutter/material.dart';
import 'package:dalil_dimashq/domain/usecase/manage_place_photo_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';

class PlacePhotoActions extends StatelessWidget {
  const PlacePhotoActions({
    required this.placeId,
    required this.photoId,
    required this.manage,
    super.key,
  });

  final String placeId;
  final int photoId;
  final ManagePlacePhotoUseCase manage;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return Column(
      children: <Widget>[
        AppButton(
          key: const Key('set-cover'),
          label: l10n.setCover,
          onPressed: () => manage.cover(placeId: placeId, photoId: photoId),
        ),
        AppButton(
          key: const Key('set-logo'),
          label: l10n.setLogo,
          onPressed: () => manage.logo(placeId: placeId, photoId: photoId),
        ),
        AppButton(
          key: const Key('delete-photo'),
          label: l10n.deletePhoto,
          onPressed: () => manage.delete(photoId),
        ),
      ],
    );
  }
}
