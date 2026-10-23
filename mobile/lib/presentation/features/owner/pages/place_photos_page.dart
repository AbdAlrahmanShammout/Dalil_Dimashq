import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/picked_photo.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/contact/bloc/contact_bloc.dart';
import 'package:dalil_dimashq/presentation/features/contact/pages/contact_page.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_photo_bloc.dart';

class PlacePhotosPage extends StatelessWidget {
  const PlacePhotosPage({
    required this.placeId,
    required this.isPremium,
    required this.bloc,
    this.onContact,
    super.key,
  });

  final String placeId;
  final bool isPremium;
  final PlacePhotoBloc bloc;
  final void Function(BuildContext context)? onContact;

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
              return ListView(
                children: <Widget>[
                  Text(l10n.photoPremiumLock, key: const Key('photo-premium-lock')),
                  AppButton(
                    key: const Key('photo-contact'),
                    label: l10n.contactUs,
                    onPressed: () => _openContact(context),
                  ),
                ],
              );
            }
            return ListView(
              children: <Widget>[
                AppButton(
                  key: const Key('pick-camera'),
                  label: l10n.takePhoto,
                  onPressed: () => bloc.add(
                    PlacePhotoPickRequested(
                      placeId: placeId,
                      origin: PhotoOrigin.camera,
                    ),
                  ),
                ),
                AppButton(
                  key: const Key('pick-gallery'),
                  label: l10n.choosePhoto,
                  onPressed: () => bloc.add(
                    PlacePhotoPickRequested(
                      placeId: placeId,
                      origin: PhotoOrigin.gallery,
                    ),
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

  void _openContact(BuildContext context) {
    final void Function(BuildContext context)? open = onContact;
    if (open != null) {
      open(context);
      return;
    }
    if (!getIt.isRegistered<ContactBloc>()) {
      return;
    }
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (BuildContext context) => const ContactPage(),
      ),
    );
  }
}
