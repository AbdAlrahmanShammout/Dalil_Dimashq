// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get appTitle => 'دليل دمشق';

  @override
  String get directorySection => 'الدليل';

  @override
  String get explore => 'استكشف';

  @override
  String get map => 'الخريطة';

  @override
  String get events => 'الفعاليات';

  @override
  String get account => 'حسابي';

  @override
  String get language => 'اللغة';

  @override
  String get english => 'الإنجليزية';

  @override
  String get arabic => 'العربية';

  @override
  String get signInRequired => 'يلزم تسجيل الدخول';

  @override
  String get owner => 'صاحب المنشأة';

  @override
  String get myPlaces => 'منشآتي';

  @override
  String get searchHint => 'ابحث بالاسم أو المطبخ أو الشارع أو المنطقة';

  @override
  String get categoryAll => 'الكل';

  @override
  String get categoryHotels => 'فنادق';

  @override
  String get categoryRestaurants => 'مطاعم';

  @override
  String get categoryCafes => 'مقاهي';

  @override
  String get featured => 'مميز';

  @override
  String get notRated => 'غير مقيّم';

  @override
  String get openNow => 'مفتوح الآن';

  @override
  String get closedNow => 'مغلق الآن';

  @override
  String get noResults => 'لا توجد نتائج';

  @override
  String get retry => 'إعادة المحاولة';

  @override
  String get filters => 'تصفية';

  @override
  String get minStars => 'الحد الأدنى للنجوم';

  @override
  String get anyStars => 'أي تقييم';

  @override
  String get area => 'المنطقة';

  @override
  String get hasPhone => 'لديه هاتف';

  @override
  String get sortLabel => 'الترتيب';

  @override
  String get sortCompleteness => 'الأكتمال';

  @override
  String get sortRating => 'التقييم';

  @override
  String get sortName => 'الاسم';

  @override
  String get clearFilters => 'مسح';

  @override
  String get applyFilters => 'تطبيق';

  @override
  String get hotelClass => 'تصنيف الفندق';

  @override
  String get mapRating => 'تقييم الخريطة';

  @override
  String get call => 'اتصال';

  @override
  String get directions => 'الاتجاهات';

  @override
  String get share => 'مشاركة';

  @override
  String get copied => 'تم النسخ';

  @override
  String get offers => 'العروض';

  @override
  String untilDate(Object date) {
    return 'حتى $date';
  }

  @override
  String get photos => 'الصور';
}
