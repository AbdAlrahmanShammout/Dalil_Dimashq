import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

String bookingStatusLabel(AppLocalizations l10n, String status) {
  switch (status) {
    case 'pending':
      return l10n.statusPending;
    case 'confirmed':
      return l10n.statusConfirmed;
    case 'rejected':
      return l10n.statusRejected;
    case 'expired':
      return l10n.statusExpired;
    case 'cancelled_by_customer':
      return l10n.statusCancelledByCustomer;
    case 'cancelled_by_owner':
      return l10n.statusCancelledByOwner;
    case 'attended':
      return l10n.statusAttended;
    case 'no_show':
      return l10n.statusNoShow;
    default:
      return l10n.statusWaiting;
  }
}
