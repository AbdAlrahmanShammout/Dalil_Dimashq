import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/entities/booking_summary.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_details_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/booking_status_label.dart';

class BookingDetailsPage extends StatelessWidget {
  const BookingDetailsPage({
    required this.booking,
    this.bloc,
    this.now,
    super.key,
  });

  final BookingSummary booking;
  final BookingDetailsBloc? bloc;
  final DateTime? now;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<BookingDetailsBloc>.value(
        value: bloc!..add(BookingDetailsStarted(booking)),
        child: _BookingDetailsView(now: now ?? DateTime.now()),
      );
    }
    if (!getIt.isRegistered<BookingDetailsBloc>()) {
      return _StaticDetails(booking: booking);
    }
    return BlocProvider<BookingDetailsBloc>(
      create: (BuildContext context) =>
          getIt<BookingDetailsBloc>()..add(BookingDetailsStarted(booking)),
      child: _BookingDetailsView(now: now ?? DateTime.now()),
    );
  }
}

class _BookingDetailsView extends StatelessWidget {
  const _BookingDetailsView({required this.now});

  final DateTime now;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<BookingDetailsBloc, BookingDetailsState>(
      builder: (BuildContext context, BookingDetailsState state) {
        final BookingSummary? booking = state.booking;
        if (booking == null) {
          return const SizedBox.shrink();
        }
        final bool canCancel =
            booking.at != null &&
            booking.at!.isAfter(now) &&
            booking.status != 'cancelled_by_customer' &&
            booking.status != 'cancelled_by_owner' &&
            booking.status != 'attended' &&
            booking.status != 'no_show' &&
            booking.status != 'rejected' &&
            booking.status != 'expired';
        return _StaticDetails(
          booking: booking,
          placeName: state.placeName,
          isReplySent: state.isReplySent,
          onCancel: canCancel
              ? () => context.read<BookingDetailsBloc>().add(
                  const BookingCancelled(),
                )
              : null,
          onReply: state.reportId == null
              ? null
              : (String reply) => context.read<BookingDetailsBloc>().add(
                  FakeReportReplySubmitted(reply),
                ),
        );
      },
    );
  }
}

class _StaticDetails extends StatelessWidget {
  const _StaticDetails({
    required this.booking,
    this.placeName,
    this.onCancel,
    this.onReply,
    this.isReplySent = false,
  });

  final BookingSummary booking;
  final String? placeName;
  final VoidCallback? onCancel;
  final void Function(String reply)? onReply;
  final bool isReplySent;

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
          if (onCancel != null)
            AppButton(label: l10n.cancelBooking, onPressed: onCancel),
          if (isReplySent) Text(l10n.replySent, key: const Key('reply-sent')),
          if (onReply != null && !isReplySent) _ReplyField(onReply: onReply!),
        ],
      ),
    );
  }
}

class _ReplyField extends StatefulWidget {
  const _ReplyField({required this.onReply});

  final void Function(String reply) onReply;

  @override
  State<_ReplyField> createState() => _ReplyFieldState();
}

class _ReplyFieldState extends State<_ReplyField> {
  final TextEditingController _reply = TextEditingController();

  @override
  void dispose() {
    _reply.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        TextField(
          key: const Key('fake-report-reply'),
          controller: _reply,
          decoration: InputDecoration(labelText: l10n.reply),
        ),
        AppButton(
          key: const Key('fake-report-send'),
          label: l10n.reply,
          onPressed: () => widget.onReply(_reply.text),
        ),
      ],
    );
  }
}
