import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/presentation/features/booking/booking_status_label.dart';
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
  final TextEditingController _note = TextEditingController();
  int _party = 1;
  bool _didFill = false;

  @override
  void dispose() {
    _name.dispose();
    _phone.dispose();
    _note.dispose();
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
            return ListView(
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
                if (state.dates.isNotEmpty)
                  Text(l10n.date),
                if (state.dates.isNotEmpty)
                  DropdownButton<DateTime>(
                    key: const Key('booking-date'),
                    value: state.selectedDate,
                    items: state.dates
                        .map(
                          (DateTime date) => DropdownMenuItem<DateTime>(
                            value: date,
                            child: Text(formatDamascusDate(date)),
                          ),
                        )
                        .toList(growable: false),
                    onChanged: (DateTime? date) {
                      if (date == null) {
                        return;
                      }
                      context.read<BookingDraftBloc>().add(
                        BookingDateSelected(date),
                      );
                    },
                  ),
                if (state.maxParty > 0)
                  DropdownButton<int>(
                    key: const Key('booking-party'),
                    value: _party > state.maxParty ? state.maxParty : _party,
                    items: List<DropdownMenuItem<int>>.generate(
                      state.maxParty,
                      (int index) => DropdownMenuItem<int>(
                        value: index + 1,
                        child: Text('${index + 1}'),
                      ),
                    ),
                    onChanged: (int? party) {
                      if (party == null) {
                        return;
                      }
                      setState(() => _party = party);
                    },
                  ),
                TextField(
                  key: const Key('booking-note'),
                  controller: _note,
                  maxLength: 300,
                  decoration: InputDecoration(labelText: l10n.note),
                ),
                if (state.bookingId != null)
                  Text(
                    '${state.bookingId}',
                    key: const Key('booking-result'),
                  ),
                if (state.bookingStatus != null)
                  Text(bookingStatusLabel(l10n, state.bookingStatus!)),
                AppButton(
                  label: l10n.send,
                  onPressed: () {
                    context.read<BookingDraftBloc>().add(
                      BookingSubmitted(
                        name: _name.text,
                        phone: _phone.text,
                        party: _party,
                        note: _note.text,
                      ),
                    );
                  },
                ),
                if (state.times.isNotEmpty)
                  Text(l10n.time),
                if (state.times.isNotEmpty)
                  DropdownButton<DateTime>(
                    key: const Key('booking-time'),
                    value: state.selectedTime,
                    items: state.times
                        .map(
                          (DateTime time) => DropdownMenuItem<DateTime>(
                            value: time,
                            child: Text(formatDamascusTime(time)),
                          ),
                        )
                        .toList(growable: false),
                    onChanged: (DateTime? time) {
                      if (time == null) {
                        return;
                      }
                      context.read<BookingDraftBloc>().add(
                        BookingTimeSelected(time),
                      );
                    },
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
}
