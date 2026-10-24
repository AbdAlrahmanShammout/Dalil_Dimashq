export interface ErrorText {
  readonly ar: string;
  readonly en: string;
}

export const ERROR_TEXT: Readonly<Record<string, ErrorText>> = {
  email_not_confirmed: {
    ar: 'يرجى تأكيد بريدك الإلكتروني أولاً.',
    en: 'Please confirm your email first.',
  },
  not_signed_in: { ar: 'يرجى تسجيل الدخول أولاً.', en: 'Please sign in first.' },
  code_attempts: {
    ar: 'تجاوزت عدد المحاولات المسموح اليوم. حاول مجدداً غداً.',
    en: 'Too many wrong codes today. Try again tomorrow.',
  },
  booking_needs_account: {
    ar: 'يرجى تسجيل الدخول بحساب مؤكَّد لإجراء الحجز.',
    en: 'Please sign in with a confirmed account to book.',
  },
  booking_blocked: {
    ar: 'الحجز غير متاح لهذا الحساب.',
    en: 'Booking is not available on this account.',
  },
  own_place_booking: { ar: 'لا يمكنك الحجز في منشأتك.', en: 'You cannot book at your own place.' },
  booking_off: {
    ar: 'لا تستقبل هذه المنشأة الحجوزات حالياً.',
    en: 'This place is not taking bookings right now.',
  },
  booking_horizon: {
    ar: 'يمكن الحجز خلال الأيام السبعة القادمة فقط.',
    en: 'You can book within the next 7 days only.',
  },
  booking_notice: {
    ar: 'تحتاج هذه المنشأة إلى مهلة أطول قبل موعد الحجز.',
    en: 'This place needs more notice before the booking time.',
  },
  booking_closed_time: {
    ar: 'المنشأة مغلقة في هذا الوقت.',
    en: 'The place is closed at that time.',
  },
  booking_quarter: {
    ar: 'يرجى اختيار وقت على رأس الربع ساعة.',
    en: 'Please pick a time on the quarter hour.',
  },
  booking_party_size: {
    ar: 'عدد الأشخاص خارج الحدود المسموحة.',
    en: 'The party size is outside the allowed range.',
  },
  booking_offer_time: { ar: 'العرض لا يشمل هذا الوقت.', en: 'The offer does not cover this time.' },
  booking_duplicate: {
    ar: 'لديك طلب حجز في هذا الوقت بالفعل.',
    en: 'You already asked for this time.',
  },
  booking_open_limit: {
    ar: 'لديك ثلاثة حجوزات مفتوحة؛ هذا هو الحد الأقصى.',
    en: 'You already have 3 open bookings, the maximum.',
  },
  booking_rate: {
    ar: 'عدد كبير من طلبات الحجز؛ حاول لاحقاً.',
    en: 'Too many booking requests; try again later.',
  },
  booking_name: { ar: 'يرجى إدخال الاسم.', en: 'Please enter your name.' },
  phone_invalid: {
    ar: 'يرجى إدخال رقم جوال سوري صحيح، مثل 09xx xxx xxx.',
    en: 'Please enter a valid Syrian mobile number, like 09xx xxx xxx.',
  },
  booking_not_found: { ar: 'الحجز غير موجود.', en: 'Booking not found.' },
  booking_cancel_late: {
    ar: 'لم يعد بالإمكان إلغاء هذا الحجز.',
    en: 'This booking can no longer be cancelled.',
  },
  booking_confirm_late: {
    ar: 'لم يعد بالإمكان تأكيد هذا الحجز.',
    en: 'This booking can no longer be confirmed.',
  },
  booking_answered: {
    ar: 'تمّ الردّ على هذا الحجز مسبقاً.',
    en: 'This booking was already answered.',
  },
  booking_cancel_confirmed: {
    ar: 'يمكن إلغاء الحجز المؤكَّد قبل موعده فقط.',
    en: 'Only a confirmed booking can be cancelled, before its time.',
  },
  booking_mark_confirmed: {
    ar: 'يمكن تسجيل الحضور للحجز المؤكَّد فقط.',
    en: 'Only a confirmed booking can be marked.',
  },
  booking_mark_window: {
    ar: 'يمكن تسجيل الحضور من نصف ساعة قبل الموعد حتى ثلاثة أيام بعده.',
    en: 'Attendance can be marked from 30 minutes before until 3 days after.',
  },
  booking_mark_missing: {
    ar: 'يرجى تحديد ما إذا حضر الزبون.',
    en: 'Please say whether the customer came.',
  },
  booking_cancel_reason: {
    ar: 'يرجى كتابة سبب الإلغاء.',
    en: 'Please write the reason for cancelling.',
  },
  fake_reason: { ar: 'يرجى كتابة سبب الإبلاغ.', en: 'Please write why this booking was fake.' },
  fake_duplicate: {
    ar: 'تمّ الإبلاغ عن هذا الحجز مسبقاً.',
    en: 'This booking was already reported.',
  },
  fake_too_old: { ar: 'انقضت مدة الإبلاغ عن هذا الحجز.', en: 'This booking is too old to report.' },
  fake_attended: {
    ar: 'لا يمكن الإبلاغ عن حجز سُجّل حضوره.',
    en: 'A booking marked attended cannot be reported.',
  },
  fake_monthly_limit: {
    ar: 'بلغت المنشأة الحد الشهري للبلاغات؛ يرجى التواصل مع دليل دمشق.',
    en: 'This place reached 5 reports this month; please contact Dalil Dimashq.',
  },
  rating_blocked: {
    ar: 'لم يعد بإمكان هذا الحساب تقييم المنشآت.',
    en: 'This account can no longer rate places.',
  },
  own_place_rating: { ar: 'لا يمكنك تقييم منشأتك.', en: 'You cannot rate your own place.' },
  rating_rate: { ar: 'تجاوزت عدد التقييمات المسموح اليوم.', en: 'Too many ratings today.' },
  needs_request: {
    ar: 'يتطلّب هذا التعديل طلباً يراجعه فريق الدليل.',
    en: 'This change needs a request reviewed by the Dalil team.',
  },
  profile_incomplete: {
    ar: 'يرجى إكمال ملفك الشخصي أولاً.',
    en: 'Please complete your profile first.',
  },
  profile_already_complete: {
    ar: 'ملفك الشخصي مكتمل. لتعديل الاسم أو سنة الميلاد أرسل طلب تعديل.',
    en: 'Your profile is complete. To change your name or birth year, send a change request.',
  },
  name_invalid: {
    ar: 'يجب أن يتكوّن كلٌّ من الاسم والكنية من حرفين إلى أربعين حرفاً دون أرقام.',
    en: 'First and last name must each be 2 to 40 letters, without digits.',
  },
  phone_taken: {
    ar: 'هذا الرقم مستخدم في حساب آخر.',
    en: 'This number is already used by another account.',
  },
  birth_year_invalid: { ar: 'يرجى إدخال سنة ميلاد صحيحة.', en: 'Please enter a valid birth year.' },
  too_young: { ar: 'يجب أن يكون عمرك ١٦ سنة أو أكثر.', en: 'You must be 16 or older.' },
  language_invalid: { ar: 'اللغة غير مدعومة.', en: 'This language is not supported.' },
  nothing_to_change: { ar: 'لا يتضمّن الطلب أي تغيير.', en: 'The request changes nothing.' },
  request_pending: {
    ar: 'لديك طلب قيد المراجعة بالفعل.',
    en: 'You already have a request under review.',
  },
  request_not_pending: {
    ar: 'هذا الطلب لم يعد قيد المراجعة.',
    en: 'This request is no longer under review.',
  },
  not_allowed: { ar: 'لا تملك صلاحية تنفيذ هذا الإجراء.', en: 'You are not allowed to do this.' },
  not_linked: {
    ar: 'هذه المنشأة غير مرتبطة بحسابك.',
    en: 'This place is not linked to your account.',
  },
  place_not_found: { ar: 'المنشأة غير موجودة.', en: 'Place not found.' },
  place_owner_limit: {
    ar: 'بلغت هذه المنشأة الحد الأقصى لعدد المالكين (ثلاثة).',
    en: 'This place already has the maximum of 3 owners.',
  },
  hours_invalid: {
    ar: 'جدول الدوام غير صحيح: تحقّق من الأوقات وألّا تتداخل الفترات، وبحدّ أقصى ثلاث فترات في اليوم.',
    en: 'The opening hours are not valid: check the times, that periods do not overlap, and at most 3 periods a day.',
  },
  legal_not_found: { ar: 'تعذّر العثور على هذه النسخة.', en: 'This version was not found.' },
  legal_kind_invalid: { ar: 'نوع المستند غير صحيح.', en: 'Unknown document type.' },
  legal_text_missing: {
    ar: 'يجب إدخال النص العربي والإنكليزي معاً.',
    en: 'Both the Arabic and the English text are required.',
  },
  legal_document_locked: {
    ar: 'لا يمكن تعديل نسخة منشورة أو حذفها؛ انشر نسخة جديدة.',
    en: 'A published version cannot be changed or deleted; publish a new one.',
  },
  payment_not_found: {
    ar: 'الدفعة غير موجودة أو ملغاة مسبقاً.',
    en: 'Payment not found, or already voided.',
  },
  payment_locked: {
    ar: 'لا يمكن تعديل دفعة محفوظة أو حذفها؛ يمكن إلغاؤها مع ذكر السبب.',
    en: 'A saved payment cannot be changed or deleted; it can be voided with a reason.',
  },
  void_reason_missing: { ar: 'يرجى كتابة سبب الإلغاء.', en: 'Please give the reason for voiding.' },
  receipt_counter_full: {
    ar: 'تجاوز عدد الإيصالات الحدّ الشهري.',
    en: 'Too many receipts this month.',
  },
  invalid_credentials: {
    ar: 'البريد أو كلمة المرور غير صحيحة.',
    en: 'The email or password is incorrect.',
  },
  invalid_code: {
    ar: 'رمز التحقق غير صحيح أو انتهت صلاحيته.',
    en: 'The code is invalid or has expired.',
  },
  password_invalid: {
    ar: 'يجب أن تتكون كلمة المرور من 10 أحرف على الأقل وتتضمن حروفاً وأرقاماً.',
    en: 'Password must be at least 10 characters and include letters and digits.',
  },
  email_taken: { ar: 'هذا البريد مستخدم بالفعل.', en: 'This email is already in use.' },
  password_mismatch: {
    ar: 'كلمة المرور الحالية غير صحيحة.',
    en: 'The current password is incorrect.',
  },
  google_token_invalid: {
    ar: 'تعذّر التحقق من حساب غوغل.',
    en: 'The Google account could not be verified.',
  },
  staff_email: {
    ar: 'لا يمكن استخدام هذا البريد من هذا الباب.',
    en: 'This email cannot be used from this door.',
  },
  password_not_set: { ar: 'عيّن كلمة مرور قبل المتابعة.', en: 'Set a password before continuing.' },
  forgot_password_sent: {
    ar: 'إذا كان الحساب موجوداً فسيصلك رمز إعادة التعيين.',
    en: 'If the account exists, a reset code is on its way.',
  },
  INTERNAL_SERVER_ERROR: {
    ar: 'حدث خطأ، يرجى المحاولة مرة أخرى.',
    en: 'Something went wrong, please try again.',
  },
  conflict: { ar: 'هذه البيانات موجودة مسبقاً.', en: 'A matching record already exists.' },
  not_found: { ar: 'العنصر المطلوب غير موجود.', en: 'Resource was not found.' },
  invalid_state: {
    ar: 'لا يمكن إكمال هذا الإجراء بالحالة الحالية.',
    en: 'This action is not valid in the current state.',
  },
  dependency_failure: {
    ar: 'خدمة خارجية غير متاحة حالياً.',
    en: 'An external service is unavailable.',
  },
  validation_failed: { ar: 'البيانات المرسلة غير صالحة.', en: 'Invalid data.' },
  BAD_USER_INPUT: { ar: 'يرجى التحقق من الحقول المدخلة.', en: 'Invalid input.' },
  too_many_requests: {
    ar: 'عدد المحاولات كبير. حاول لاحقاً.',
    en: 'Too many requests. Try again later.',
  },
  http_error: { ar: 'تعذّر تنفيذ الطلب.', en: 'The request could not be completed.' },
};
