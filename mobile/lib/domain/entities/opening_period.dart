class OpeningPeriod {
  const OpeningPeriod({
    required this.weekday,
    required this.opens,
    required this.closes,
  });

  final int weekday;
  final String opens;
  final String closes;
}

class PlaceWeek {
  const PlaceWeek({this.periods = const <OpeningPeriod>[]});

  static const int maxPeriodsPerDay = 3;

  final List<OpeningPeriod> periods;

  int countFor(int weekday) {
    return periods.where((OpeningPeriod period) => period.weekday == weekday).length;
  }

  PlaceWeek add(OpeningPeriod period) {
    if (countFor(period.weekday) >= maxPeriodsPerDay) {
      return this;
    }
    return PlaceWeek(periods: <OpeningPeriod>[...periods, period]);
  }

  List<OpeningPeriod> forDay(int weekday) {
    return periods
        .where((OpeningPeriod period) => period.weekday == weekday)
        .toList(growable: false);
  }
}

List<OpeningPeriod> regularOpeningPeriods(List<Map<String, dynamic>> rows) {
  return rows
      .where((Map<String, dynamic> row) => row['season'] != 'ramadan')
      .map(
        (Map<String, dynamic> row) => OpeningPeriod(
          weekday: row['weekday'] as int? ?? 0,
          opens: '${row['opens']}',
          closes: '${row['closes']}',
        ),
      )
      .toList(growable: false);
}
