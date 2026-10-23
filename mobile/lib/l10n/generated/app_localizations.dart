import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'Dalil Dimashq'**
  String get appTitle;

  /// No description provided for @directorySection.
  ///
  /// In en, this message translates to:
  /// **'Directory'**
  String get directorySection;

  /// No description provided for @explore.
  ///
  /// In en, this message translates to:
  /// **'Explore'**
  String get explore;

  /// No description provided for @map.
  ///
  /// In en, this message translates to:
  /// **'Map'**
  String get map;

  /// No description provided for @events.
  ///
  /// In en, this message translates to:
  /// **'Events'**
  String get events;

  /// No description provided for @account.
  ///
  /// In en, this message translates to:
  /// **'Account'**
  String get account;

  /// No description provided for @language.
  ///
  /// In en, this message translates to:
  /// **'Language'**
  String get language;

  /// No description provided for @english.
  ///
  /// In en, this message translates to:
  /// **'English'**
  String get english;

  /// No description provided for @arabic.
  ///
  /// In en, this message translates to:
  /// **'Arabic'**
  String get arabic;

  /// No description provided for @signInRequired.
  ///
  /// In en, this message translates to:
  /// **'Sign in required'**
  String get signInRequired;

  /// No description provided for @owner.
  ///
  /// In en, this message translates to:
  /// **'Owner'**
  String get owner;

  /// No description provided for @myPlaces.
  ///
  /// In en, this message translates to:
  /// **'My places'**
  String get myPlaces;

  /// No description provided for @searchHint.
  ///
  /// In en, this message translates to:
  /// **'Search by name, cuisine, street, or area'**
  String get searchHint;

  /// No description provided for @categoryAll.
  ///
  /// In en, this message translates to:
  /// **'All'**
  String get categoryAll;

  /// No description provided for @categoryHotels.
  ///
  /// In en, this message translates to:
  /// **'Hotels'**
  String get categoryHotels;

  /// No description provided for @categoryRestaurants.
  ///
  /// In en, this message translates to:
  /// **'Restaurants'**
  String get categoryRestaurants;

  /// No description provided for @categoryCafes.
  ///
  /// In en, this message translates to:
  /// **'Cafés'**
  String get categoryCafes;

  /// No description provided for @featured.
  ///
  /// In en, this message translates to:
  /// **'Featured'**
  String get featured;

  /// No description provided for @notRated.
  ///
  /// In en, this message translates to:
  /// **'Not rated'**
  String get notRated;

  /// No description provided for @openNow.
  ///
  /// In en, this message translates to:
  /// **'Open now'**
  String get openNow;

  /// No description provided for @closedNow.
  ///
  /// In en, this message translates to:
  /// **'Closed now'**
  String get closedNow;

  /// No description provided for @noResults.
  ///
  /// In en, this message translates to:
  /// **'No matching places'**
  String get noResults;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @filters.
  ///
  /// In en, this message translates to:
  /// **'Filters'**
  String get filters;

  /// No description provided for @minStars.
  ///
  /// In en, this message translates to:
  /// **'Minimum stars'**
  String get minStars;

  /// No description provided for @anyStars.
  ///
  /// In en, this message translates to:
  /// **'Any'**
  String get anyStars;

  /// No description provided for @area.
  ///
  /// In en, this message translates to:
  /// **'Area'**
  String get area;

  /// No description provided for @hasPhone.
  ///
  /// In en, this message translates to:
  /// **'Has phone'**
  String get hasPhone;

  /// No description provided for @sortLabel.
  ///
  /// In en, this message translates to:
  /// **'Sort'**
  String get sortLabel;

  /// No description provided for @sortCompleteness.
  ///
  /// In en, this message translates to:
  /// **'Completeness'**
  String get sortCompleteness;

  /// No description provided for @sortRating.
  ///
  /// In en, this message translates to:
  /// **'Rating'**
  String get sortRating;

  /// No description provided for @sortName.
  ///
  /// In en, this message translates to:
  /// **'Name'**
  String get sortName;

  /// No description provided for @clearFilters.
  ///
  /// In en, this message translates to:
  /// **'Clear'**
  String get clearFilters;

  /// No description provided for @applyFilters.
  ///
  /// In en, this message translates to:
  /// **'Apply'**
  String get applyFilters;

  /// No description provided for @hotelClass.
  ///
  /// In en, this message translates to:
  /// **'Hotel class'**
  String get hotelClass;

  /// No description provided for @mapRating.
  ///
  /// In en, this message translates to:
  /// **'Map rating'**
  String get mapRating;

  /// No description provided for @call.
  ///
  /// In en, this message translates to:
  /// **'Call'**
  String get call;

  /// No description provided for @directions.
  ///
  /// In en, this message translates to:
  /// **'Directions'**
  String get directions;

  /// No description provided for @share.
  ///
  /// In en, this message translates to:
  /// **'Share'**
  String get share;

  /// No description provided for @copied.
  ///
  /// In en, this message translates to:
  /// **'Copied'**
  String get copied;

  /// No description provided for @offers.
  ///
  /// In en, this message translates to:
  /// **'Offers'**
  String get offers;

  /// No description provided for @untilDate.
  ///
  /// In en, this message translates to:
  /// **'Until {date}'**
  String untilDate(Object date);

  /// No description provided for @photos.
  ///
  /// In en, this message translates to:
  /// **'Photos'**
  String get photos;

  /// No description provided for @overview.
  ///
  /// In en, this message translates to:
  /// **'Overview'**
  String get overview;

  /// No description provided for @location.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get location;

  /// No description provided for @hours.
  ///
  /// In en, this message translates to:
  /// **'Hours'**
  String get hours;

  /// No description provided for @sunday.
  ///
  /// In en, this message translates to:
  /// **'Sunday'**
  String get sunday;

  /// No description provided for @monday.
  ///
  /// In en, this message translates to:
  /// **'Monday'**
  String get monday;

  /// No description provided for @tuesday.
  ///
  /// In en, this message translates to:
  /// **'Tuesday'**
  String get tuesday;

  /// No description provided for @wednesday.
  ///
  /// In en, this message translates to:
  /// **'Wednesday'**
  String get wednesday;

  /// No description provided for @thursday.
  ///
  /// In en, this message translates to:
  /// **'Thursday'**
  String get thursday;

  /// No description provided for @friday.
  ///
  /// In en, this message translates to:
  /// **'Friday'**
  String get friday;

  /// No description provided for @saturday.
  ///
  /// In en, this message translates to:
  /// **'Saturday'**
  String get saturday;

  /// No description provided for @contact.
  ///
  /// In en, this message translates to:
  /// **'Contact'**
  String get contact;

  /// No description provided for @website.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get website;

  /// No description provided for @facebook.
  ///
  /// In en, this message translates to:
  /// **'Facebook'**
  String get facebook;

  /// No description provided for @instagram.
  ///
  /// In en, this message translates to:
  /// **'Instagram'**
  String get instagram;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @address.
  ///
  /// In en, this message translates to:
  /// **'Address'**
  String get address;

  /// No description provided for @openPlace.
  ///
  /// In en, this message translates to:
  /// **'Open place'**
  String get openPlace;

  /// No description provided for @nearMe.
  ///
  /// In en, this message translates to:
  /// **'Near me'**
  String get nearMe;

  /// No description provided for @signUp.
  ///
  /// In en, this message translates to:
  /// **'Sign up'**
  String get signUp;

  /// No description provided for @password.
  ///
  /// In en, this message translates to:
  /// **'Password'**
  String get password;

  /// No description provided for @displayName.
  ///
  /// In en, this message translates to:
  /// **'Display name'**
  String get displayName;

  /// No description provided for @createAccount.
  ///
  /// In en, this message translates to:
  /// **'Create account'**
  String get createAccount;

  /// No description provided for @passwordRule.
  ///
  /// In en, this message translates to:
  /// **'Use 10 or more characters, with letters and digits'**
  String get passwordRule;

  /// No description provided for @confirmationSent.
  ///
  /// In en, this message translates to:
  /// **'Check your email to confirm the account'**
  String get confirmationSent;

  /// No description provided for @signIn.
  ///
  /// In en, this message translates to:
  /// **'Sign in'**
  String get signIn;

  /// No description provided for @signedIn.
  ///
  /// In en, this message translates to:
  /// **'Signed in'**
  String get signedIn;

  /// No description provided for @confirmEmailFirst.
  ///
  /// In en, this message translates to:
  /// **'Confirm your email before continuing'**
  String get confirmEmailFirst;

  /// No description provided for @forgotPassword.
  ///
  /// In en, this message translates to:
  /// **'Forgot password'**
  String get forgotPassword;

  /// No description provided for @sendRecovery.
  ///
  /// In en, this message translates to:
  /// **'Send recovery email'**
  String get sendRecovery;

  /// No description provided for @recoverySent.
  ///
  /// In en, this message translates to:
  /// **'Check your email for password recovery'**
  String get recoverySent;

  /// No description provided for @ageCheck.
  ///
  /// In en, this message translates to:
  /// **'I am 16 or older'**
  String get ageCheck;

  /// No description provided for @ageRequired.
  ///
  /// In en, this message translates to:
  /// **'You must be 16 or older'**
  String get ageRequired;

  /// No description provided for @profile.
  ///
  /// In en, this message translates to:
  /// **'Profile'**
  String get profile;

  /// No description provided for @phone.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get phone;

  /// No description provided for @save.
  ///
  /// In en, this message translates to:
  /// **'Save'**
  String get save;

  /// No description provided for @profileSaved.
  ///
  /// In en, this message translates to:
  /// **'Profile saved'**
  String get profileSaved;

  /// No description provided for @booking.
  ///
  /// In en, this message translates to:
  /// **'Booking'**
  String get booking;

  /// No description provided for @settings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settings;

  /// No description provided for @notifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notifications;

  /// No description provided for @privacyPolicy.
  ///
  /// In en, this message translates to:
  /// **'Privacy policy'**
  String get privacyPolicy;

  /// No description provided for @privacyUpdated.
  ///
  /// In en, this message translates to:
  /// **'Last updated 16 October 2026. If the texts differ, the Arabic version prevails.'**
  String get privacyUpdated;

  /// No description provided for @privacyWho.
  ///
  /// In en, this message translates to:
  /// **'Dalil Dimashq is registered in Damascus under commercial register 0110098519.'**
  String get privacyWho;

  /// No description provided for @privacyCollected.
  ///
  /// In en, this message translates to:
  /// **'We may keep contact messages, owner accounts, visitor accounts, bookings, fake-booking reports, suggestions with an IP fingerprint, location, camera use, notification tokens, and technical information.'**
  String get privacyCollected;

  /// No description provided for @privacyStorage.
  ///
  /// In en, this message translates to:
  /// **'We do not use tracking cookies or third-party analytics.'**
  String get privacyStorage;

  /// No description provided for @privacyServices.
  ///
  /// In en, this message translates to:
  /// **'The service uses Netlify, Supabase, Resend, Firebase Cloud Messaging, Google Fonts, map tiles, Nominatim, and Photon.'**
  String get privacyServices;

  /// No description provided for @privacyRights.
  ///
  /// In en, this message translates to:
  /// **'You can ask what is stored, how long it is kept, and who receives it. You can delete your account. The app is for people aged 16 or older.'**
  String get privacyRights;

  /// No description provided for @firstName.
  ///
  /// In en, this message translates to:
  /// **'First name'**
  String get firstName;

  /// No description provided for @lastName.
  ///
  /// In en, this message translates to:
  /// **'Last name'**
  String get lastName;

  /// No description provided for @birthYear.
  ///
  /// In en, this message translates to:
  /// **'Birth year'**
  String get birthYear;

  /// No description provided for @completeProfile.
  ///
  /// In en, this message translates to:
  /// **'Complete profile'**
  String get completeProfile;

  /// No description provided for @profileChangePending.
  ///
  /// In en, this message translates to:
  /// **'Your name change is under review'**
  String get profileChangePending;

  /// No description provided for @termsAndPrivacy.
  ///
  /// In en, this message translates to:
  /// **'Terms and privacy'**
  String get termsAndPrivacy;

  /// No description provided for @accept.
  ///
  /// In en, this message translates to:
  /// **'Accept'**
  String get accept;

  /// No description provided for @legalUpToDate.
  ///
  /// In en, this message translates to:
  /// **'There is no new version to accept'**
  String get legalUpToDate;

  /// No description provided for @terms.
  ///
  /// In en, this message translates to:
  /// **'Terms'**
  String get terms;

  /// No description provided for @privacy.
  ///
  /// In en, this message translates to:
  /// **'Privacy'**
  String get privacy;

  /// No description provided for @whatsapp.
  ///
  /// In en, this message translates to:
  /// **'WhatsApp'**
  String get whatsapp;

  /// No description provided for @contactChannels.
  ///
  /// In en, this message translates to:
  /// **'Contact'**
  String get contactChannels;

  /// No description provided for @deleteAccount.
  ///
  /// In en, this message translates to:
  /// **'Delete account'**
  String get deleteAccount;

  /// No description provided for @accountDeleted.
  ///
  /// In en, this message translates to:
  /// **'Account deleted'**
  String get accountDeleted;

  /// No description provided for @signOut.
  ///
  /// In en, this message translates to:
  /// **'Sign out'**
  String get signOut;

  /// No description provided for @contactUs.
  ///
  /// In en, this message translates to:
  /// **'Contact us'**
  String get contactUs;

  /// No description provided for @contactValue.
  ///
  /// In en, this message translates to:
  /// **'Email or phone'**
  String get contactValue;

  /// No description provided for @message.
  ///
  /// In en, this message translates to:
  /// **'Message'**
  String get message;

  /// No description provided for @send.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get send;

  /// No description provided for @contactSent.
  ///
  /// In en, this message translates to:
  /// **'Message sent'**
  String get contactSent;

  /// No description provided for @contactTypeGeneral.
  ///
  /// In en, this message translates to:
  /// **'General'**
  String get contactTypeGeneral;

  /// No description provided for @contactTypeFacility.
  ///
  /// In en, this message translates to:
  /// **'Add a place'**
  String get contactTypeFacility;

  /// No description provided for @contactTypePartnership.
  ///
  /// In en, this message translates to:
  /// **'Partnership'**
  String get contactTypePartnership;

  /// No description provided for @contactTypeOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get contactTypeOther;

  /// No description provided for @messageTooLarge.
  ///
  /// In en, this message translates to:
  /// **'The message is too large'**
  String get messageTooLarge;

  /// No description provided for @contactRateLimited.
  ///
  /// In en, this message translates to:
  /// **'Please wait before sending another message'**
  String get contactRateLimited;

  /// No description provided for @suggestion.
  ///
  /// In en, this message translates to:
  /// **'Suggestion'**
  String get suggestion;

  /// No description provided for @optionalPlace.
  ///
  /// In en, this message translates to:
  /// **'Place (optional)'**
  String get optionalPlace;

  /// No description provided for @suggestionKindPending.
  ///
  /// In en, this message translates to:
  /// **'Suggestion types are not confirmed yet'**
  String get suggestionKindPending;

  /// No description provided for @book.
  ///
  /// In en, this message translates to:
  /// **'Book'**
  String get book;

  /// No description provided for @date.
  ///
  /// In en, this message translates to:
  /// **'Date'**
  String get date;

  /// No description provided for @time.
  ///
  /// In en, this message translates to:
  /// **'Time'**
  String get time;

  /// No description provided for @note.
  ///
  /// In en, this message translates to:
  /// **'Note'**
  String get note;

  /// No description provided for @partySize.
  ///
  /// In en, this message translates to:
  /// **'Party size'**
  String get partySize;

  /// No description provided for @statusWaiting.
  ///
  /// In en, this message translates to:
  /// **'Waiting'**
  String get statusWaiting;

  /// No description provided for @statusPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get statusPending;

  /// No description provided for @statusConfirmed.
  ///
  /// In en, this message translates to:
  /// **'Confirmed'**
  String get statusConfirmed;

  /// No description provided for @statusRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get statusRejected;

  /// No description provided for @statusExpired.
  ///
  /// In en, this message translates to:
  /// **'Expired'**
  String get statusExpired;

  /// No description provided for @statusCancelledByCustomer.
  ///
  /// In en, this message translates to:
  /// **'Cancelled by you'**
  String get statusCancelledByCustomer;

  /// No description provided for @statusCancelledByOwner.
  ///
  /// In en, this message translates to:
  /// **'Cancelled by the place'**
  String get statusCancelledByOwner;

  /// No description provided for @statusAttended.
  ///
  /// In en, this message translates to:
  /// **'Attended'**
  String get statusAttended;

  /// No description provided for @statusNoShow.
  ///
  /// In en, this message translates to:
  /// **'No show'**
  String get statusNoShow;

  /// No description provided for @myBookings.
  ///
  /// In en, this message translates to:
  /// **'My bookings'**
  String get myBookings;

  /// No description provided for @bookingReason.
  ///
  /// In en, this message translates to:
  /// **'Reason'**
  String get bookingReason;

  /// No description provided for @cancelBooking.
  ///
  /// In en, this message translates to:
  /// **'Cancel booking'**
  String get cancelBooking;

  /// No description provided for @reply.
  ///
  /// In en, this message translates to:
  /// **'Reply'**
  String get reply;

  /// No description provided for @replySent.
  ///
  /// In en, this message translates to:
  /// **'Reply sent'**
  String get replySent;

  /// No description provided for @banFifteen.
  ///
  /// In en, this message translates to:
  /// **'New bookings are blocked for 15 days.'**
  String get banFifteen;

  /// No description provided for @banFortyFive.
  ///
  /// In en, this message translates to:
  /// **'New bookings are blocked for 45 days.'**
  String get banFortyFive;

  /// No description provided for @banPermanent.
  ///
  /// In en, this message translates to:
  /// **'New bookings are blocked permanently.'**
  String get banPermanent;

  /// No description provided for @banLadder.
  ///
  /// In en, this message translates to:
  /// **'The first ban is 15 days, the next is 45 days, then it is permanent.'**
  String get banLadder;

  /// No description provided for @inbox.
  ///
  /// In en, this message translates to:
  /// **'Inbox'**
  String get inbox;

  /// No description provided for @unread.
  ///
  /// In en, this message translates to:
  /// **'Unread'**
  String get unread;

  /// No description provided for @noticeBookingNew.
  ///
  /// In en, this message translates to:
  /// **'New booking'**
  String get noticeBookingNew;

  /// No description provided for @noticeClockStarted.
  ///
  /// In en, this message translates to:
  /// **'Reply window started'**
  String get noticeClockStarted;

  /// No description provided for @noticeConfirmed.
  ///
  /// In en, this message translates to:
  /// **'Booking confirmed'**
  String get noticeConfirmed;

  /// No description provided for @noticeRejected.
  ///
  /// In en, this message translates to:
  /// **'Booking rejected'**
  String get noticeRejected;

  /// No description provided for @noticeExpired.
  ///
  /// In en, this message translates to:
  /// **'Booking expired'**
  String get noticeExpired;

  /// No description provided for @noticeCancelledByCustomer.
  ///
  /// In en, this message translates to:
  /// **'Booking cancelled by the visitor'**
  String get noticeCancelledByCustomer;

  /// No description provided for @noticeCancelledByOwner.
  ///
  /// In en, this message translates to:
  /// **'Booking cancelled by the place'**
  String get noticeCancelledByOwner;

  /// No description provided for @noticeFakeReported.
  ///
  /// In en, this message translates to:
  /// **'Booking reported'**
  String get noticeFakeReported;

  /// No description provided for @noticeFakeReportNew.
  ///
  /// In en, this message translates to:
  /// **'New fake-booking report'**
  String get noticeFakeReportNew;

  /// No description provided for @noticeFakeReportDecided.
  ///
  /// In en, this message translates to:
  /// **'Report decided'**
  String get noticeFakeReportDecided;

  /// No description provided for @noticeBanStarted.
  ///
  /// In en, this message translates to:
  /// **'Booking ban started'**
  String get noticeBanStarted;

  /// No description provided for @noticeBanLifted.
  ///
  /// In en, this message translates to:
  /// **'Booking ban lifted'**
  String get noticeBanLifted;

  /// No description provided for @premiumUntil.
  ///
  /// In en, this message translates to:
  /// **'Premium until {date}'**
  String premiumUntil(String date);

  /// No description provided for @pendingRequests.
  ///
  /// In en, this message translates to:
  /// **'{count} pending requests'**
  String pendingRequests(int count);

  /// No description provided for @searchPlaces.
  ///
  /// In en, this message translates to:
  /// **'Search places'**
  String get searchPlaces;

  /// No description provided for @linkWithCode.
  ///
  /// In en, this message translates to:
  /// **'Link with code'**
  String get linkWithCode;

  /// No description provided for @placeCode.
  ///
  /// In en, this message translates to:
  /// **'DD- code'**
  String get placeCode;

  /// No description provided for @placeLinked.
  ///
  /// In en, this message translates to:
  /// **'Place linked'**
  String get placeLinked;

  /// No description provided for @invalidCode.
  ///
  /// In en, this message translates to:
  /// **'That code is not valid'**
  String get invalidCode;

  /// No description provided for @requestClaim.
  ///
  /// In en, this message translates to:
  /// **'Send for review'**
  String get requestClaim;

  /// No description provided for @claimSent.
  ///
  /// In en, this message translates to:
  /// **'Claim sent for review'**
  String get claimSent;

  /// No description provided for @ownerHours.
  ///
  /// In en, this message translates to:
  /// **'Hours'**
  String get ownerHours;

  /// No description provided for @ownerAmenities.
  ///
  /// In en, this message translates to:
  /// **'Amenities'**
  String get ownerAmenities;

  /// No description provided for @ownerPhotos.
  ///
  /// In en, this message translates to:
  /// **'Photos'**
  String get ownerPhotos;

  /// No description provided for @ownerOffers.
  ///
  /// In en, this message translates to:
  /// **'Offers'**
  String get ownerOffers;

  /// No description provided for @ownerBookings.
  ///
  /// In en, this message translates to:
  /// **'Bookings'**
  String get ownerBookings;

  /// No description provided for @ownerRequests.
  ///
  /// In en, this message translates to:
  /// **'Requests'**
  String get ownerRequests;

  /// No description provided for @ownerSettings.
  ///
  /// In en, this message translates to:
  /// **'Booking settings'**
  String get ownerSettings;

  /// No description provided for @viewAsVisitor.
  ///
  /// In en, this message translates to:
  /// **'View as visitor'**
  String get viewAsVisitor;

  /// No description provided for @editDetails.
  ///
  /// In en, this message translates to:
  /// **'Edit details'**
  String get editDetails;

  /// No description provided for @detailsSaved.
  ///
  /// In en, this message translates to:
  /// **'Details saved'**
  String get detailsSaved;

  /// No description provided for @premiumRequired.
  ///
  /// In en, this message translates to:
  /// **'Premium is required for this change'**
  String get premiumRequired;

  /// No description provided for @phones.
  ///
  /// In en, this message translates to:
  /// **'Phones'**
  String get phones;

  /// No description provided for @descriptionAr.
  ///
  /// In en, this message translates to:
  /// **'Arabic description'**
  String get descriptionAr;

  /// No description provided for @descriptionEn.
  ///
  /// In en, this message translates to:
  /// **'English description'**
  String get descriptionEn;

  /// No description provided for @changesSent.
  ///
  /// In en, this message translates to:
  /// **'Changes sent for review'**
  String get changesSent;

  /// No description provided for @tourismClass.
  ///
  /// In en, this message translates to:
  /// **'Tourism class'**
  String get tourismClass;

  /// No description provided for @placeType.
  ///
  /// In en, this message translates to:
  /// **'Type'**
  String get placeType;

  /// No description provided for @placeNameAr.
  ///
  /// In en, this message translates to:
  /// **'Arabic name'**
  String get placeNameAr;

  /// No description provided for @placeNameEn.
  ///
  /// In en, this message translates to:
  /// **'English name'**
  String get placeNameEn;

  /// No description provided for @requestPending.
  ///
  /// In en, this message translates to:
  /// **'Pending'**
  String get requestPending;

  /// No description provided for @requestAccepted.
  ///
  /// In en, this message translates to:
  /// **'Accepted'**
  String get requestAccepted;

  /// No description provided for @requestRejected.
  ///
  /// In en, this message translates to:
  /// **'Rejected'**
  String get requestRejected;

  /// No description provided for @decisionNote.
  ///
  /// In en, this message translates to:
  /// **'Decision note'**
  String get decisionNote;

  /// No description provided for @addPeriod.
  ///
  /// In en, this message translates to:
  /// **'Add hours'**
  String get addPeriod;

  /// No description provided for @saveHours.
  ///
  /// In en, this message translates to:
  /// **'Save hours'**
  String get saveHours;

  /// No description provided for @hoursSaved.
  ///
  /// In en, this message translates to:
  /// **'Saved'**
  String get hoursSaved;

  /// No description provided for @hoursRequested.
  ///
  /// In en, this message translates to:
  /// **'Sent for review'**
  String get hoursRequested;

  /// No description provided for @takePhoto.
  ///
  /// In en, this message translates to:
  /// **'Take a photo'**
  String get takePhoto;

  /// No description provided for @choosePhoto.
  ///
  /// In en, this message translates to:
  /// **'Choose from gallery'**
  String get choosePhoto;

  /// No description provided for @setCover.
  ///
  /// In en, this message translates to:
  /// **'Set cover'**
  String get setCover;

  /// No description provided for @setLogo.
  ///
  /// In en, this message translates to:
  /// **'Set logo'**
  String get setLogo;

  /// No description provided for @deletePhoto.
  ///
  /// In en, this message translates to:
  /// **'Delete photo'**
  String get deletePhoto;

  /// No description provided for @photoPremiumLock.
  ///
  /// In en, this message translates to:
  /// **'Contact us to add photos with Premium.'**
  String get photoPremiumLock;

  /// No description provided for @offerTitle.
  ///
  /// In en, this message translates to:
  /// **'Offer title'**
  String get offerTitle;

  /// No description provided for @offerDetails.
  ///
  /// In en, this message translates to:
  /// **'Offer details'**
  String get offerDetails;

  /// No description provided for @createOffer.
  ///
  /// In en, this message translates to:
  /// **'Create offer'**
  String get createOffer;

  /// No description provided for @stopOffer.
  ///
  /// In en, this message translates to:
  /// **'Stop offer'**
  String get stopOffer;

  /// No description provided for @deleteOffer.
  ///
  /// In en, this message translates to:
  /// **'Delete offer'**
  String get deleteOffer;

  /// No description provided for @offerSaved.
  ///
  /// In en, this message translates to:
  /// **'Offer saved'**
  String get offerSaved;

  /// No description provided for @offerTooLong.
  ///
  /// In en, this message translates to:
  /// **'An offer can run for 60 days'**
  String get offerTooLong;

  /// No description provided for @offerPremiumLock.
  ///
  /// In en, this message translates to:
  /// **'Contact us to add offers with Premium.'**
  String get offerPremiumLock;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
