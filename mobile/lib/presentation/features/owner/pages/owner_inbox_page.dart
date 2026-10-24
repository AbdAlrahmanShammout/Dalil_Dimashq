import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_details_page.dart';
import 'package:dalil_dimashq/presentation/features/notifications/notification_label.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/owner_inbox_bloc.dart';

class OwnerInboxPage extends StatelessWidget {
  const OwnerInboxPage({this.bloc, super.key});

  final OwnerInboxBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<OwnerInboxBloc>.value(
        value: bloc!..add(const OwnerInboxStarted()),
        child: const _OwnerInboxView(),
      );
    }
    if (!getIt.isRegistered<OwnerInboxBloc>()) {
      return const SizedBox.shrink();
    }
    return BlocProvider<OwnerInboxBloc>(
      create: (BuildContext context) =>
          getIt<OwnerInboxBloc>()..add(const OwnerInboxStarted()),
      child: const _OwnerInboxView(),
    );
  }
}

class _OwnerInboxView extends StatelessWidget {
  const _OwnerInboxView();

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return AppScaffold(
      title: l10n.ownerInbox,
      body: BlocConsumer<OwnerInboxBloc, OwnerInboxState>(
        listenWhen: (OwnerInboxState previous, OwnerInboxState current) =>
            current.openedBooking != null &&
            current.openedBooking != previous.openedBooking,
        listener: (BuildContext context, OwnerInboxState state) {
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
        builder: (BuildContext context, OwnerInboxState state) {
          return ListView(
            children: state.notifications
                .map(
                  (notification) => ListTile(
                    key: Key('owner-notice-${notification.id}'),
                    onTap: () {
                      context.read<OwnerInboxBloc>().add(
                        OwnerInboxTapped(notification),
                      );
                    },
                    title: Text(notificationLabel(l10n, notification.kind)),
                  ),
                )
                .toList(growable: false),
          );
        },
      ),
    );
  }
}
