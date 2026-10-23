import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/place_immediate_fields.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/immediate_fields_bloc.dart';

class ImmediateFieldsPage extends StatefulWidget {
  const ImmediateFieldsPage({
    required this.placeId,
    required this.bloc,
    super.key,
  });

  final String placeId;
  final ImmediateFieldsBloc bloc;

  @override
  State<ImmediateFieldsPage> createState() => _ImmediateFieldsPageState();
}

class _ImmediateFieldsPageState extends State<ImmediateFieldsPage> {
  final TextEditingController _phones = TextEditingController();
  final TextEditingController _website = TextEditingController();
  final TextEditingController _email = TextEditingController();
  final TextEditingController _facebook = TextEditingController();
  final TextEditingController _instagram = TextEditingController();
  final TextEditingController _descriptionAr = TextEditingController();
  final TextEditingController _descriptionEn = TextEditingController();

  @override
  void dispose() {
    _phones.dispose();
    _website.dispose();
    _email.dispose();
    _facebook.dispose();
    _instagram.dispose();
    _descriptionAr.dispose();
    _descriptionEn.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<ImmediateFieldsBloc>.value(
      value: widget.bloc,
      child: AppScaffold(
        title: l10n.editDetails,
        body: BlocBuilder<ImmediateFieldsBloc, ImmediateFieldsState>(
          builder: (BuildContext context, ImmediateFieldsState state) {
            return ListView(
              padding: const EdgeInsets.all(16),
              children: <Widget>[
                TextField(
                  key: const Key('field-phones'),
                  controller: _phones,
                  decoration: InputDecoration(labelText: l10n.phones),
                ),
                TextField(
                  key: const Key('field-website'),
                  controller: _website,
                  decoration: InputDecoration(labelText: l10n.website),
                ),
                TextField(
                  key: const Key('field-email'),
                  controller: _email,
                  decoration: InputDecoration(labelText: l10n.email),
                ),
                TextField(
                  key: const Key('field-facebook'),
                  controller: _facebook,
                  decoration: InputDecoration(labelText: l10n.facebook),
                ),
                TextField(
                  key: const Key('field-instagram'),
                  controller: _instagram,
                  decoration: InputDecoration(labelText: l10n.instagram),
                ),
                TextField(
                  key: const Key('field-description-ar'),
                  controller: _descriptionAr,
                  decoration: InputDecoration(labelText: l10n.descriptionAr),
                ),
                TextField(
                  key: const Key('field-description-en'),
                  controller: _descriptionEn,
                  decoration: InputDecoration(labelText: l10n.descriptionEn),
                ),
                AppButton(
                  key: const Key('save-immediate'),
                  label: l10n.editDetails,
                  onPressed: () => widget.bloc.add(
                    ImmediateFieldsSaved(
                      placeId: widget.placeId,
                      fields: PlaceImmediateFields(
                        phones: _phones.text
                            .split(',')
                            .map((String phone) => phone.trim())
                            .where((String phone) => phone.isNotEmpty)
                            .toList(growable: false),
                        website: _website.text,
                        email: _email.text,
                        facebook: _facebook.text,
                        instagram: _instagram.text,
                        descriptionAr: _descriptionAr.text,
                        descriptionEn: _descriptionEn.text,
                      ),
                    ),
                  ),
                ),
                if (state.isSaved)
                  Text(l10n.detailsSaved, key: const Key('details-saved')),
                if (state.errorCode == 'premium_required')
                  Text(l10n.premiumRequired, key: const Key('premium-required')),
              ],
            );
          },
        ),
      ),
    );
  }
}
