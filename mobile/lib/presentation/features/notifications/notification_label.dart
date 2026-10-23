import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';

String notificationLabel(AppLocalizations l10n, String kind) {
  switch (kind) {
    case 'booking_clock_started':
      return l10n.noticeClockStarted;
    case 'booking_confirmed':
      return l10n.noticeConfirmed;
    case 'booking_rejected':
      return l10n.noticeRejected;
    case 'booking_expired':
      return l10n.noticeExpired;
    case 'booking_cancelled_by_customer':
      return l10n.noticeCancelledByCustomer;
    case 'booking_cancelled_by_owner':
      return l10n.noticeCancelledByOwner;
    case 'fake_reported':
      return l10n.noticeFakeReported;
    case 'fake_report_new':
      return l10n.noticeFakeReportNew;
    case 'fake_report_decided':
      return l10n.noticeFakeReportDecided;
    case 'booking_ban_started':
      return l10n.noticeBanStarted;
    case 'booking_ban_lifted':
      return l10n.noticeBanLifted;
    default:
      return l10n.noticeBookingNew;
  }
}
