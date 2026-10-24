bool canReportFakeBooking({required bool reported, required String status}) {
  return !reported && status != 'attended';
}
