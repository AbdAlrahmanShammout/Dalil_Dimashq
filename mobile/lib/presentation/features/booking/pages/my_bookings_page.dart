import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/domain/services/booking_slots.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/my_bookings_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/booking_status_label.dart';

class MyBookingsPage extends StatelessWidget {
  const MyBookingsPage({this.bloc, super.key});

  final MyBookingsBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<MyBookingsBloc>.value(
        value: bloc!..add(const MyBookingsStarted()),
        child: const _MyBookingsView(),
      );
    }
    return BlocProvider<MyBookingsBloc>(
      create: (BuildContext context) =>
          getIt<MyBookingsBloc>()..add(const MyBookingsStarted()),
      child: const _MyBookingsView(),
    );
  }
}

class _MyBookingsView extends StatelessWidget {
  const _MyBookingsView();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.myBookings,
      body: BlocBuilder<MyBookingsBloc, MyBookingsState>(
        builder: (BuildContext context, MyBookingsState state) {
          return ListView(
            children: state.bookings
                .map(
                  (booking) => ListTile(
                    key: Key('booking-${booking.id}'),
                    title: Text('${booking.id}'),
                    subtitle: Text(
                      booking.at == null
                          ? bookingStatusLabel(l10n, booking.status)
                          : '${formatDamascusDate(booking.at!.toUtc().add(damascusOffset))} ${bookingStatusLabel(l10n, booking.status)}',
                    ),
                  ),
                )
                .toList(growable: false),
          );
        },
      ),
    );
  }
}
