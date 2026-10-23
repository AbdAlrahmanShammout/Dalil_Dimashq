class DalilErrorText {
  const DalilErrorText({required this.ar, required this.en});
  final String ar;
  final String en;
}

const String unknownErrorCode = 'unknown_error';
const String notAllowedCode = 'not_allowed';

const Map<String, DalilErrorText> dalilErrorTexts = <String, DalilErrorText>{
  "not_signed_in": DalilErrorText(
    ar: "\u064A\u0631\u062C\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0623\u0648\u0644\u0627\u064B.",
    en: "Please sign in first.",
  ),
  "email_not_confirmed": DalilErrorText(
    ar: "\u064A\u0631\u062C\u0649 \u062A\u0623\u0643\u064A\u062F \u0628\u0631\u064A\u062F\u0643 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0623\u0648\u0644\u0627\u064B.",
    en: "Please confirm your email first.",
  ),
  "profile_incomplete": DalilErrorText(
    ar: "\u064A\u0631\u062C\u0649 \u0625\u0643\u0645\u0627\u0644 \u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062E\u0635\u064A \u0623\u0648\u0644\u0627\u064B.",
    en: "Please complete your profile first.",
  ),
  "profile_already_complete": DalilErrorText(
    ar: "\u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062E\u0635\u064A \u0645\u0643\u062A\u0645\u0644. \u0644\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0633\u0646\u0629 \u0627\u0644\u0645\u064A\u0644\u0627\u062F \u0623\u0631\u0633\u0644 \u0637\u0644\u0628 \u062A\u0639\u062F\u064A\u0644.",
    en: "Your profile is complete. To change your name or birth year, send a change request.",
  ),
  "name_invalid": DalilErrorText(
    ar: "\u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0643\u0648\u0651\u0646 \u0643\u0644\u064C\u0651 \u0645\u0646 \u0627\u0644\u0627\u0633\u0645 \u0648\u0627\u0644\u0643\u0646\u064A\u0629 \u0645\u0646 \u062D\u0631\u0641\u064A\u0646 \u0625\u0644\u0649 \u0623\u0631\u0628\u0639\u064A\u0646 \u062D\u0631\u0641\u0627\u064B \u062F\u0648\u0646 \u0623\u0631\u0642\u0627\u0645.",
    en: "First and last name must each be 2 to 40 letters, without digits.",
  ),
  "phone_invalid": DalilErrorText(
    ar: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u062C\u0648\u0627\u0644 \u0633\u0648\u0631\u064A \u0635\u062D\u064A\u062D\u060C \u0645\u062B\u0644 09xx xxx xxx.",
    en: "Please enter a valid Syrian mobile number, like 09xx xxx xxx.",
  ),
  "phone_taken": DalilErrorText(
    ar: "\u0647\u0630\u0627 \u0627\u0644\u0631\u0642\u0645 \u0645\u0633\u062A\u062E\u062F\u0645 \u0641\u064A \u062D\u0633\u0627\u0628 \u0622\u062E\u0631.",
    en: "This number is already used by another account.",
  ),
  "birth_year_invalid": DalilErrorText(
    ar: "\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0633\u0646\u0629 \u0645\u064A\u0644\u0627\u062F \u0635\u062D\u064A\u062D\u0629.",
    en: "Please enter a valid birth year.",
  ),
  "too_young": DalilErrorText(
    ar: "\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0639\u0645\u0631\u0643 \u0661\u0666 \u0633\u0646\u0629 \u0623\u0648 \u0623\u0643\u062B\u0631.",
    en: "You must be 16 or older.",
  ),
  "language_invalid": DalilErrorText(
    ar: "\u0627\u0644\u0644\u063A\u0629 \u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645\u0629.",
    en: "This language is not supported.",
  ),
  "nothing_to_change": DalilErrorText(
    ar: "\u0644\u0627 \u064A\u062A\u0636\u0645\u0651\u0646 \u0627\u0644\u0637\u0644\u0628 \u0623\u064A \u062A\u063A\u064A\u064A\u0631.",
    en: "The request changes nothing.",
  ),
  "request_pending": DalilErrorText(
    ar: "\u0644\u062F\u064A\u0643 \u0637\u0644\u0628 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0628\u0627\u0644\u0641\u0639\u0644.",
    en: "You already have a request under review.",
  ),
  "request_not_pending": DalilErrorText(
    ar: "\u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0644\u0645 \u064A\u0639\u062F \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629.",
    en: "This request is no longer under review.",
  ),
  "not_allowed": DalilErrorText(
    ar: "\u0644\u0627 \u062A\u0645\u0644\u0643 \u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0646\u0641\u064A\u0630 \u0647\u0630\u0627 \u0627\u0644\u0625\u062C\u0631\u0627\u0621.",
    en: "You are not allowed to do this.",
  ),
  "not_linked": DalilErrorText(
    ar: "\u0647\u0630\u0647 \u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u063A\u064A\u0631 \u0645\u0631\u062A\u0628\u0637\u0629 \u0628\u062D\u0633\u0627\u0628\u0643.",
    en: "This place is not linked to your account.",
  ),
  "place_not_found": DalilErrorText(
    ar: "\u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629.",
    en: "Place not found.",
  ),
  "place_owner_limit": DalilErrorText(
    ar: "\u0628\u0644\u063A\u062A \u0647\u0630\u0647 \u0627\u0644\u0645\u0646\u0634\u0623\u0629 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0639\u062F\u062F \u0627\u0644\u0645\u0627\u0644\u0643\u064A\u0646 (\u062B\u0644\u0627\u062B\u0629).",
    en: "This place already has the maximum of 3 owners.",
  ),
  "hours_invalid": DalilErrorText(
    ar: "\u062C\u062F\u0648\u0644 \u0627\u0644\u062F\u0648\u0627\u0645 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D: \u062A\u062D\u0642\u0651\u0642 \u0645\u0646 \u0627\u0644\u0623\u0648\u0642\u0627\u062A \u0648\u0623\u0644\u0651\u0627 \u062A\u062A\u062F\u0627\u062E\u0644 \u0627\u0644\u0641\u062A\u0631\u0627\u062A\u060C \u0648\u0628\u062D\u062F\u0651 \u0623\u0642\u0635\u0649 \u062B\u0644\u0627\u062B \u0641\u062A\u0631\u0627\u062A \u0641\u064A \u0627\u0644\u064A\u0648\u0645.",
    en: "The opening hours are not valid: check the times, that periods do not overlap, and at most 3 periods a day.",
  ),
  "legal_not_found": DalilErrorText(
    ar: "\u062A\u0639\u0630\u0651\u0631 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0647\u0630\u0647 \u0627\u0644\u0646\u0633\u062E\u0629.",
    en: "This version was not found.",
  ),
  "legal_kind_invalid": DalilErrorText(
    ar: "\u0646\u0648\u0639 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u063A\u064A\u0631 \u0635\u062D\u064A\u062D.",
    en: "Unknown document type.",
  ),
  "legal_text_missing": DalilErrorText(
    ar: "\u064A\u062C\u0628 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0646\u0635 \u0627\u0644\u0639\u0631\u0628\u064A \u0648\u0627\u0644\u0625\u0646\u0643\u0644\u064A\u0632\u064A \u0645\u0639\u0627\u064B.",
    en: "Both the Arabic and the English text are required.",
  ),
  "legal_document_locked": DalilErrorText(
    ar: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0639\u062F\u064A\u0644 \u0646\u0633\u062E\u0629 \u0645\u0646\u0634\u0648\u0631\u0629 \u0623\u0648 \u062D\u0630\u0641\u0647\u0627\u061B \u0627\u0646\u0634\u0631 \u0646\u0633\u062E\u0629 \u062C\u062F\u064A\u062F\u0629.",
    en: "A published version cannot be changed or deleted; publish a new one.",
  ),
  "payment_not_found": DalilErrorText(
    ar: "\u0627\u0644\u062F\u0641\u0639\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629 \u0623\u0648 \u0645\u0644\u063A\u0627\u0629 \u0645\u0633\u0628\u0642\u0627\u064B.",
    en: "Payment not found, or already voided.",
  ),
  "payment_locked": DalilErrorText(
    ar: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0639\u062F\u064A\u0644 \u062F\u0641\u0639\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u0623\u0648 \u062D\u0630\u0641\u0647\u0627\u061B \u064A\u0645\u0643\u0646 \u0625\u0644\u063A\u0627\u0624\u0647\u0627 \u0645\u0639 \u0630\u0643\u0631 \u0627\u0644\u0633\u0628\u0628.",
    en: "A saved payment cannot be changed or deleted; it can be voided with a reason.",
  ),
  "void_reason_missing": DalilErrorText(
    ar: "\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0633\u0628\u0628 \u0627\u0644\u0625\u0644\u063A\u0627\u0621.",
    en: "Please give the reason for voiding.",
  ),
  "receipt_counter_full": DalilErrorText(
    ar: "\u062A\u062C\u0627\u0648\u0632 \u0639\u062F\u062F \u0627\u0644\u0625\u064A\u0635\u0627\u0644\u0627\u062A \u0627\u0644\u062D\u062F\u0651 \u0627\u0644\u0634\u0647\u0631\u064A.",
    en: "Too many receipts this month.",
  ),
  unknownErrorCode: DalilErrorText(
    ar: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
    en: 'Something went wrong, please try again.',
  ),
};

const List<DalilErrorPrefix> dalilErrorPrefixes = <DalilErrorPrefix>[
  DalilErrorPrefix(
    prefix: "Mark the booking from 30 minutes before it until 3 days after",
    code: "booking_mark_window",
  ),
  DalilErrorPrefix(
    prefix: "Only a confirmed booking can be cancelled, before its time",
    code: "booking_cancel_confirmed",
  ),
  DalilErrorPrefix(
    prefix: "A booking marked attended cannot be reported as fake",
    code: "fake_attended",
  ),
  DalilErrorPrefix(
    prefix: "This booking is no longer waiting for an answer",
    code: "booking_answered",
  ),
  DalilErrorPrefix(
    prefix: "This place has reached 5 reports this month",
    code: "fake_monthly_limit",
  ),
  DalilErrorPrefix(
    prefix: "Sign in with a confirmed account to book",
    code: "booking_needs_account",
  ),
  DalilErrorPrefix(
    prefix: "This booking can no longer be cancelled",
    code: "booking_cancel_late",
  ),
  DalilErrorPrefix(
    prefix: "This booking can no longer be confirmed",
    code: "booking_confirm_late",
  ),
  DalilErrorPrefix(
    prefix: "This account can no longer rate places",
    code: "rating_blocked",
  ),
  DalilErrorPrefix(
    prefix: "Only a confirmed booking can be marked",
    code: "booking_mark_confirmed",
  ),
  DalilErrorPrefix(
    prefix: "Owners cannot book at their own place",
    code: "own_place_booking",
  ),
  DalilErrorPrefix(
    prefix: "That offer does not cover this time",
    code: "booking_offer_time",
  ),
  DalilErrorPrefix(
    prefix: "Booking is blocked on this account",
    code: "booking_blocked",
  ),
  DalilErrorPrefix(
    prefix: "Owners cannot rate their own place",
    code: "own_place_rating",
  ),
  DalilErrorPrefix(
    prefix: "This booking was already reported",
    code: "fake_duplicate",
  ),
  DalilErrorPrefix(
    prefix: "This place is not taking bookings",
    code: "booking_off",
  ),
  DalilErrorPrefix(
    prefix: "This booking is too old to report",
    code: "fake_too_old",
  ),
  DalilErrorPrefix(
    prefix: "The place is closed at that time",
    code: "booking_closed_time",
  ),
  DalilErrorPrefix(
    prefix: "You already have 3 open bookings",
    code: "booking_open_limit",
  ),
  DalilErrorPrefix(
    prefix: "Write the reason for cancelling",
    code: "booking_cancel_reason",
  ),
  DalilErrorPrefix(
    prefix: "Write why this booking was fake",
    code: "fake_reason",
  ),
  DalilErrorPrefix(
    prefix: "You already asked for this time",
    code: "booking_duplicate",
  ),
  DalilErrorPrefix(
    prefix: "Pick a time on the quarter hour",
    code: "booking_quarter",
  ),
  DalilErrorPrefix(
    prefix: "Say whether the customer came",
    code: "booking_mark_missing",
  ),
  DalilErrorPrefix(
    prefix: "Enter a valid phone number",
    code: "phone_invalid",
  ),
  DalilErrorPrefix(
    prefix: "Party size must be between",
    code: "booking_party_size",
  ),
  DalilErrorPrefix(
    prefix: "Too many wrong codes today",
    code: "code_attempts",
  ),
  DalilErrorPrefix(
    prefix: "Too many booking requests",
    code: "booking_rate",
  ),
  DalilErrorPrefix(
    prefix: "This place needs at least",
    code: "booking_notice",
  ),
  DalilErrorPrefix(
    prefix: "Name, category, location",
    code: "needs_request",
  ),
  DalilErrorPrefix(
    prefix: "Confirm your email first",
    code: "email_not_confirmed",
  ),
  DalilErrorPrefix(
    prefix: "Too many ratings today",
    code: "rating_rate",
  ),
  DalilErrorPrefix(
    prefix: "Booking not found",
    code: "booking_not_found",
  ),
  DalilErrorPrefix(
    prefix: "Enter your name",
    code: "booking_name",
  ),
  DalilErrorPrefix(
    prefix: "Sign in first",
    code: "not_signed_in",
  ),
  DalilErrorPrefix(
    prefix: "Book within",
    code: "booking_horizon",
  ),
];

class DalilErrorPrefix {
  const DalilErrorPrefix({required this.prefix, required this.code});
  final String prefix;
  final String code;
}

String resolveDalilErrorCode(String? message, String? sqlstate) {
  final String text = message?.trim() ?? '';
  if (dalilErrorTexts.containsKey(text)) {
    return text;
  }
  for (final DalilErrorPrefix entry in dalilErrorPrefixes) {
    if (text.startsWith(entry.prefix)) {
      return entry.code;
    }
  }
  if (sqlstate == '42501') {
    return notAllowedCode;
  }
  return unknownErrorCode;
}

String dalilErrorText(String code, String languageCode) {
  final DalilErrorText? text = dalilErrorTexts[code];
  if (text == null) {
    return code;
  }
  return languageCode == 'ar' ? text.ar : text.en;
}
