import 'package:flutter/material.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/owner_offer.dart';
import 'package:dalil_dimashq/domain/usecase/manage_owner_offer_use_case.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/contact/bloc/contact_bloc.dart';
import 'package:dalil_dimashq/presentation/features/contact/pages/contact_page.dart';

class OwnerOffersPage extends StatefulWidget {
  const OwnerOffersPage({
    required this.placeId,
    required this.manage,
    required this.now,
    required this.isPremium,
    this.offerId,
    this.onContact,
    super.key,
  });

  final String placeId;
  final ManageOwnerOfferUseCase manage;
  final DateTime now;
  final bool isPremium;
  final int? offerId;
  final void Function(BuildContext context)? onContact;

  @override
  State<OwnerOffersPage> createState() => _OwnerOffersPageState();
}

class _OwnerOffersPageState extends State<OwnerOffersPage> {
  final TextEditingController _title = TextEditingController();
  final TextEditingController _details = TextEditingController();
  final TextEditingController _days = TextEditingController(text: '10');
  final TextEditingController _photo = TextEditingController();
  String? _message;

  @override
  void dispose() {
    _title.dispose();
    _details.dispose();
    _days.dispose();
    _photo.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    if (!widget.isPremium) {
      return AppScaffold(
        title: l10n.ownerOffers,
        body: ListView(
          children: <Widget>[
            Text(l10n.offerPremiumLock, key: const Key('offer-premium-lock')),
            AppButton(
              key: const Key('offer-contact'),
              label: l10n.contactUs,
              onPressed: () => _openContact(context),
            ),
          ],
        ),
      );
    }
    return AppScaffold(
      title: l10n.ownerOffers,
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: <Widget>[
          TextField(
            key: const Key('offer-title'),
            controller: _title,
            decoration: InputDecoration(labelText: l10n.offerTitle),
          ),
          TextField(
            key: const Key('offer-details'),
            controller: _details,
            decoration: InputDecoration(labelText: l10n.offerDetails),
          ),
          TextField(
            key: const Key('offer-days'),
            controller: _days,
          ),
          TextField(
            key: const Key('offer-photo'),
            controller: _photo,
          ),
          AppButton(
            key: const Key('create-offer'),
            label: l10n.createOffer,
            onPressed: _create,
          ),
          if (widget.offerId != null) ...<Widget>[
            AppButton(
              key: const Key('stop-offer'),
              label: l10n.stopOffer,
              onPressed: () async {
                await widget.manage.stop(
                  offerId: widget.offerId!,
                  endsAt: widget.now,
                );
                setState(() => _message = 'stopped');
              },
            ),
            AppButton(
              key: const Key('delete-offer'),
              label: l10n.deleteOffer,
              onPressed: () async {
                await widget.manage.delete(widget.offerId!);
                setState(() => _message = 'deleted');
              },
            ),
          ],
          if (_message == 'saved')
            Text(l10n.offerSaved, key: const Key('offer-saved')),
          if (_message == 'too_long')
            Text(l10n.offerTooLong, key: const Key('offer-too-long')),
          if (_message == 'stopped')
            const Text('stopped', key: Key('offer-stopped')),
          if (_message == 'deleted')
            const Text('deleted', key: Key('offer-deleted')),
        ],
      ),
    );
  }

  void _openContact(BuildContext context) {
    final void Function(BuildContext context)? open = widget.onContact;
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

  Future<void> _create() async {
    final int days = int.tryParse(_days.text) ?? 0;
    final result = await widget.manage.create(
      placeId: widget.placeId,
      now: widget.now,
      offer: OwnerOffer(
        titleAr: _title.text,
        detailsAr: _details.text,
        startsAt: widget.now,
        endsAt: widget.now.add(Duration(days: days)),
        photoPath: _photo.text,
      ),
    );
    setState(() => _message = result.isRight() ? 'saved' : 'too_long');
  }
}
