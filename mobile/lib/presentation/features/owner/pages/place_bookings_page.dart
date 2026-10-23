import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/owner_booking.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/booking_status_label.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/place_bookings_bloc.dart';

class PlaceBookingsPage extends StatelessWidget {
  const PlaceBookingsPage({
    required this.placeId,
    required this.bloc,
    super.key,
  });

  final String placeId;
  final PlaceBookingsBloc bloc;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<PlaceBookingsBloc>.value(
      value: bloc..add(PlaceBookingsStarted(placeId)),
      child: AppScaffold(
        title: l10n.ownerBookings,
        body: BlocBuilder<PlaceBookingsBloc, PlaceBookingsState>(
          builder: (BuildContext context, PlaceBookingsState state) {
            return ListView(
              children: state.bookings.map((OwnerBooking booking) {
                return ListTile(
                  key: Key('owner-booking-${booking.id}'),
                  title: Text('${booking.customerName} · ${booking.customerPhone}'),
                  subtitle: Text(
                    '${formatDamascusTime(booking.at)} · ${booking.party} · ${booking.note ?? ''} · ${bookingStatusLabel(l10n, booking.status)}${booking.reported ? ' · ${l10n.reportedBooking}' : ''}',
                  ),
                );
              }).toList(growable: false),
            );
          },
        ),
      ),
    );
  }
}
