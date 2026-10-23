import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_details_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/booking_status_label.dart';

class BookingDetailsPage extends StatelessWidget {
  const BookingDetailsPage({required this.booking, this.bloc, super.key});

  final BookingSummary booking;
  final BookingDetailsBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<BookingDetailsBloc>.value(
        value: bloc!..add(BookingDetailsStarted(booking)),
        child: const _BookingDetailsView(),
      );
    }
    if (!getIt.isRegistered<BookingDetailsBloc>()) {
      return _StaticDetails(booking: booking);
    }
    return BlocProvider<BookingDetailsBloc>(
      create: (BuildContext context) =>
          getIt<BookingDetailsBloc>()..add(BookingDetailsStarted(booking)),
      child: const _BookingDetailsView(),
    );
  }
}

class _BookingDetailsView extends StatelessWidget {
  const _BookingDetailsView();

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BookingDetailsBloc, BookingDetailsState>(
      builder: (BuildContext context, BookingDetailsState state) {
        final BookingSummary? booking = state.booking;
        if (booking == null) {
          return const SizedBox.shrink();
        }
        return _StaticDetails(booking: booking, placeName: state.placeName);
      },
    );
  }
}

class _StaticDetails extends StatelessWidget {
  const _StaticDetails({required this.booking, this.placeName});

  final BookingSummary booking;
  final String? placeName;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final DateTime? at = booking.at;
    return AppScaffold(
      title: l10n.booking,
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: <Widget>[
          Text(placeName ?? booking.placeId ?? '', key: const Key('booking-place')),
          if (at != null)
            Text(
              '${formatDamascusDate(at.toUtc().add(damascusOffset))} ${formatDamascusTime(at)}',
            ),
          Text('${l10n.partySize}: ${booking.party ?? ''}'),
          if (booking.note != null) Text(booking.note!),
          if (booking.reason != null)
            Text('${l10n.bookingReason}: ${booking.reason}'),
          Text(bookingStatusLabel(l10n, booking.status)),
        ],
      ),
    );
  }
}
