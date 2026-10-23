import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/booking_status_label.dart';
import 'package:dalil_dimashq/domain/usecase/decide_booking_use_case.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_bookings_bloc.dart';

class PlaceBookingsPage extends StatefulWidget {
  const PlaceBookingsPage({
    required this.placeId,
    required this.bloc,
    this.decide,
    super.key,
  });

  final String placeId;
  final PlaceBookingsBloc bloc;
  final DecideBookingUseCase? decide;

  @override
  State<PlaceBookingsPage> createState() => _PlaceBookingsPageState();
}

class _PlaceBookingsPageState extends State<PlaceBookingsPage> {
  final TextEditingController _reason = TextEditingController();
  String? _status;

  @override
  void dispose() {
    _reason.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final DecideBookingUseCase? decide = widget.decide;
    return BlocProvider<PlaceBookingsBloc>.value(
      value: widget.bloc..add(PlaceBookingsStarted(widget.placeId)),
      child: AppScaffold(
        title: l10n.ownerBookings,
        body: BlocBuilder<PlaceBookingsBloc, PlaceBookingsState>(
          builder: (BuildContext context, PlaceBookingsState state) {
            return ListView(
              children: <Widget>[
                if (decide != null)
                  TextField(
                    key: const Key('reject-reason'),
                    controller: _reason,
                    decoration: InputDecoration(labelText: l10n.optionalReason),
                  ),
                ...state.bookings.map((OwnerBooking booking) {
                  return Column(
                    children: <Widget>[
                      ListTile(
                        key: Key('owner-booking-${booking.id}'),
                        title: Text(
                          '${booking.customerName} · ${booking.customerPhone}',
                        ),
                        subtitle: Text(
                          '${formatDamascusTime(booking.at)} · ${booking.party} · ${booking.note ?? ''} · ${bookingStatusLabel(l10n, booking.status)}${booking.reported ? ' · ${l10n.reportedBooking}' : ''}',
                        ),
                      ),
                      if (decide != null) ...<Widget>[
                        AppButton(
                          key: Key('confirm-${booking.id}'),
                          label: l10n.confirmBooking,
                          onPressed: () async {
                            final result = await decide.confirm(booking.id);
                            result.fold((_) {}, (String status) {
                              setState(() => _status = status);
                            });
                          },
                        ),
                        AppButton(
                          key: Key('reject-${booking.id}'),
                          label: l10n.rejectBooking,
                          onPressed: () async {
                            final result = await decide.reject(
                              id: booking.id,
                              reason: _reason.text,
                            );
                            result.fold((_) {}, (String status) {
                              setState(() => _status = status);
                            });
                          },
                        ),
                      ],
                    ],
                  );
                }),
                if (_status != null)
                  Text(
                    bookingStatusLabel(l10n, _status!),
                    key: const Key('decision-status'),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
}
