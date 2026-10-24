import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/booking_status_label.dart';
import 'package:dalil_dimashq/domain/services/attendance_window.dart';
import 'package:dalil_dimashq/domain/usecase/decide_booking_use_case.dart';
import 'package:dalil_dimashq/domain/usecase/settle_booking_use_case.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_bookings_bloc.dart';

class PlaceBookingsPage extends StatefulWidget {
  const PlaceBookingsPage({
    required this.placeId,
    required this.bloc,
    this.decide,
    this.settle,
    this.now,
    super.key,
  });

  final String placeId;
  final PlaceBookingsBloc bloc;
  final DecideBookingUseCase? decide;
  final SettleBookingUseCase? settle;
  final DateTime? now;

  @override
  State<PlaceBookingsPage> createState() => _PlaceBookingsPageState();
}

class _PlaceBookingsPageState extends State<PlaceBookingsPage> {
  final TextEditingController _reason = TextEditingController();
  final TextEditingController _cancelReason = TextEditingController();
  String? _status;

  @override
  void dispose() {
    _reason.dispose();
    _cancelReason.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final DecideBookingUseCase? decide = widget.decide;
    final SettleBookingUseCase? settle = widget.settle;
    final DateTime now = widget.now ?? DateTime.now();
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
                if (settle != null)
                  TextField(
                    key: const Key('cancel-reason'),
                    controller: _cancelReason,
                    decoration: InputDecoration(labelText: l10n.cancelReason),
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
                      if (settle != null)
                        AppButton(
                          key: Key('cancel-${booking.id}'),
                          label: l10n.cancelThisBooking,
                          onPressed: () => _cancel(settle, booking, now),
                        ),
                      if (settle != null &&
                          canMarkAttendance(bookingAt: booking.at, now: now))
                        ...<Widget>[
                          AppButton(
                            key: Key('attended-${booking.id}'),
                            label: l10n.markAttended,
                            onPressed: () => _mark(
                              settle,
                              booking,
                              now,
                              attended: true,
                            ),
                          ),
                          AppButton(
                            key: Key('no-show-${booking.id}'),
                            label: l10n.markNoShow,
                            onPressed: () => _mark(
                              settle,
                              booking,
                              now,
                              attended: false,
                            ),
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

  Future<void> _cancel(
    SettleBookingUseCase settle,
    OwnerBooking booking,
    DateTime now,
  ) async {
    final result = await settle.cancel(
      id: booking.id,
      reason: _cancelReason.text,
      bookingAt: booking.at,
      now: now,
    );
    result.fold((_) {}, (String status) {
      setState(() => _status = status);
    });
  }

  Future<void> _mark(
    SettleBookingUseCase settle,
    OwnerBooking booking,
    DateTime now, {
    required bool attended,
  }) async {
    final result = await settle.mark(
      id: booking.id,
      attended: attended,
      bookingAt: booking.at,
      now: now,
    );
    result.fold((_) {}, (String status) {
      setState(() => _status = status);
    });
  }
}
