import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_details_page.dart';
import 'package:dalil_dimashq/presentation/features/notifications/bloc/inbox_bloc.dart';
import 'package:dalil_dimashq/presentation/features/notifications/notification_label.dart';

class InboxPage extends StatelessWidget {
  const InboxPage({this.bloc, super.key});

  final InboxBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<InboxBloc>.value(
        value: bloc!..add(const InboxStarted()),
        child: const _InboxView(),
      );
    }
    if (!getIt.isRegistered<InboxBloc>()) {
      return const SizedBox.shrink();
    }
    return BlocProvider<InboxBloc>(
      create: (BuildContext context) =>
          getIt<InboxBloc>()..add(const InboxStarted()),
      child: const _InboxView(),
    );
  }
}

class _InboxView extends StatelessWidget {
  const _InboxView();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.inbox,
      body: BlocConsumer<InboxBloc, InboxState>(
        listenWhen: (InboxState previous, InboxState current) =>
            current.openedBooking != null &&
            current.openedBooking != previous.openedBooking,
        listener: (BuildContext context, InboxState state) {
          final booking = state.openedBooking;
          if (booking == null) {
            return;
          }
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (BuildContext context) =>
                  BookingDetailsPage(booking: booking),
            ),
          );
        },
        builder: (BuildContext context, InboxState state) {
          return ListView(
            children: state.notifications
                .map(
                  (notification) => ListTile(
                    key: Key('notice-${notification.id}'),
                    onTap: () {
                      context.read<InboxBloc>().add(InboxTapped(notification));
                    },
                    title: Text(
                      notificationLabel(l10n, notification.kind),
                      style: TextStyle(
                        fontWeight: notification.isRead
                            ? FontWeight.normal
                            : FontWeight.bold,
                      ),
                    ),
                    subtitle: notification.isRead
                        ? null
                        : Text(l10n.unread, key: Key('unread-${notification.id}')),
                  ),
                )
                .toList(growable: false),
          );
        },
      ),
    );
  }
}
