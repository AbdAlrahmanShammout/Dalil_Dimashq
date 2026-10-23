import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/reviewed_place_changes.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/reviewed_changes_bloc.dart';

class ReviewedChangesPage extends StatefulWidget {
  const ReviewedChangesPage({
    required this.placeId,
    required this.bloc,
    super.key,
  });

  final String placeId;
  final ReviewedChangesBloc bloc;

  @override
  State<ReviewedChangesPage> createState() => _ReviewedChangesPageState();
}

class _ReviewedChangesPageState extends State<ReviewedChangesPage> {
  final TextEditingController _nameAr = TextEditingController();
  final TextEditingController _nameEn = TextEditingController();
  final TextEditingController _type = TextEditingController();
  final TextEditingController _address = TextEditingController();
  final TextEditingController _tourismClass = TextEditingController();

  @override
  void dispose() {
    _nameAr.dispose();
    _nameEn.dispose();
    _type.dispose();
    _address.dispose();
    _tourismClass.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<ReviewedChangesBloc>.value(
      value: widget.bloc,
      child: AppScaffold(
        title: l10n.requestClaim,
        body: BlocBuilder<ReviewedChangesBloc, ReviewedChangesState>(
          builder: (BuildContext context, ReviewedChangesState state) {
            return ListView(
              padding: const EdgeInsets.all(16),
              children: <Widget>[
                TextField(
                  key: const Key('review-name-ar'),
                  controller: _nameAr,
                  decoration: InputDecoration(labelText: l10n.placeNameAr),
                ),
                TextField(
                  key: const Key('review-name-en'),
                  controller: _nameEn,
                  decoration: InputDecoration(labelText: l10n.placeNameEn),
                ),
                TextField(
                  key: const Key('review-type'),
                  controller: _type,
                  decoration: InputDecoration(labelText: l10n.placeType),
                ),
                TextField(
                  key: const Key('review-address'),
                  controller: _address,
                  decoration: InputDecoration(labelText: l10n.address),
                ),
                TextField(
                  key: const Key('review-class'),
                  controller: _tourismClass,
                  decoration: InputDecoration(labelText: l10n.tourismClass),
                ),
                AppButton(
                  key: const Key('send-reviewed'),
                  label: l10n.requestClaim,
                  onPressed: () => widget.bloc.add(
                    ReviewedChangesSubmitted(
                      placeId: widget.placeId,
                      changes: ReviewedPlaceChanges(
                        nameAr: _nameAr.text,
                        nameEn: _nameEn.text,
                        type: _type.text,
                        address: _address.text,
                        tourismClass: int.tryParse(_tourismClass.text),
                      ),
                    ),
                  ),
                ),
                if (state.isSent)
                  Text(l10n.changesSent, key: const Key('changes-sent')),
              ],
            );
          },
        ),
      ),
    );
  }
}
