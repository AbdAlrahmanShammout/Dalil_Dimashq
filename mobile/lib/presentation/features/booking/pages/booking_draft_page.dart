import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_event.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_draft_state.dart';

class BookingDraftPage extends StatelessWidget {
  const BookingDraftPage({this.bloc, this.placeId, super.key});

  final BookingDraftBloc? bloc;
  final String? placeId;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<BookingDraftBloc>.value(
        value: bloc!..add(BookingDraftStarted(placeId: placeId)),
        child: const _BookingDraftForm(),
      );
    }
    return BlocProvider<BookingDraftBloc>(
      create: (BuildContext context) =>
          getIt<BookingDraftBloc>()..add(BookingDraftStarted(placeId: placeId)),
      child: const _BookingDraftForm(),
    );
  }
}

class _BookingDraftForm extends StatefulWidget {
  const _BookingDraftForm();

  @override
  State<_BookingDraftForm> createState() => _BookingDraftFormState();
}

class _BookingDraftFormState extends State<_BookingDraftForm> {
  final TextEditingController _name = TextEditingController();
  final TextEditingController _phone = TextEditingController();
  bool _didFill = false;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.booking,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: BlocConsumer<BookingDraftBloc, BookingDraftState>(
          listener: (BuildContext context, BookingDraftState state) {
            if (_didFill) {
              return;
            }
            _name.text = state.displayName;
            _phone.text = state.phone;
            _didFill = true;
          },
          builder: (BuildContext context, BookingDraftState state) {
            return Column(
              children: <Widget>[
                TextField(
                  key: const Key('booking-name'),
                  controller: _name,
                  decoration: InputDecoration(labelText: l10n.displayName),
                ),
                TextField(
                  key: const Key('booking-phone'),
                  controller: _phone,
                  decoration: InputDecoration(labelText: l10n.phone),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
