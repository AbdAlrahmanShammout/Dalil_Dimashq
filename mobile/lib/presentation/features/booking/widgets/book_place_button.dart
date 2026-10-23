import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/features/auth/pages/sign_in_page.dart';
import 'package:dalil_dimashq/presentation/features/booking/bloc/booking_gate_bloc.dart';
import 'package:dalil_dimashq/presentation/features/booking/pages/booking_draft_page.dart';

class BookPlaceButton extends StatelessWidget {
  const BookPlaceButton({
    required this.placeId,
    this.bloc,
    this.onOpen,
    super.key,
  });

  final String placeId;
  final BookingGateBloc? bloc;
  final void Function(bool hasSession)? onOpen;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<BookingGateBloc>.value(
        value: bloc!..add(BookingGateStarted(placeId)),
        child: _BookControl(placeId: placeId, onOpen: onOpen),
      );
    }
    if (!getIt.isRegistered<BookingGateBloc>()) {
      return const SizedBox.shrink();
    }
    return BlocProvider<BookingGateBloc>(
      create: (BuildContext context) =>
          getIt<BookingGateBloc>()..add(BookingGateStarted(placeId)),
      child: _BookControl(placeId: placeId, onOpen: onOpen),
    );
  }
}

class _BookControl extends StatelessWidget {
  const _BookControl({required this.placeId, this.onOpen});

  final String placeId;
  final void Function(bool hasSession)? onOpen;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocBuilder<BookingGateBloc, BookingGateState>(
      builder: (BuildContext context, BookingGateState state) {
        if (!state.canBook) {
          return const SizedBox.shrink();
        }
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: AppButton(
            label: l10n.book,
            onPressed: () => _open(context, state),
          ),
        );
      },
    );
  }

  void _open(BuildContext context, BookingGateState state) {
    final void Function(bool hasSession)? open = onOpen;
    if (open != null) {
      open(state.hasSession);
      return;
    }
    if (!state.hasSession) {
      Navigator.of(context).push(
        MaterialPageRoute<void>(
          builder: (BuildContext context) => const SignInPage(),
        ),
      );
      return;
    }
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (BuildContext context) => BookingDraftPage(placeId: placeId),
      ),
    );
  }
}
