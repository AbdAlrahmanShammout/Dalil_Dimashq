import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/place_booking_settings.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/booking_settings_bloc.dart';

class BookingSettingsPage extends StatefulWidget {
  const BookingSettingsPage({
    required this.placeId,
    required this.bloc,
    super.key,
  });

  final String placeId;
  final BookingSettingsBloc bloc;

  @override
  State<BookingSettingsPage> createState() => _BookingSettingsPageState();
}

class _BookingSettingsPageState extends State<BookingSettingsPage> {
  final TextEditingController _party = TextEditingController();
  final TextEditingController _notice = TextEditingController();
  final TextEditingController _weekday = TextEditingController();
  final TextEditingController _opens = TextEditingController();
  final TextEditingController _closes = TextEditingController();
  final TextEditingController _start = TextEditingController();
  final TextEditingController _end = TextEditingController();
  final TextEditingController _closureReason = TextEditingController();
  bool _accepting = false;
  bool _seeded = false;

  @override
  void initState() {
    super.initState();
    widget.bloc.add(BookingSettingsStarted(widget.placeId));
  }

  @override
  void dispose() {
    _party.dispose();
    _notice.dispose();
    _weekday.dispose();
    _opens.dispose();
    _closes.dispose();
    _start.dispose();
    _end.dispose();
    _closureReason.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<BookingSettingsBloc>.value(
      value: widget.bloc,
      child: AppScaffold(
        title: l10n.ownerSettings,
        body: BlocBuilder<BookingSettingsBloc, BookingSettingsState>(
          builder: (BuildContext context, BookingSettingsState state) {
            _seed(state.settings);
            final PlaceBookingSettings? settings = state.settings;
            return ListView(
              children: <Widget>[
                SwitchListTile(
                  key: const Key('accepting'),
                  title: Text(l10n.acceptBookings),
                  value: _accepting,
                  onChanged: (bool value) => setState(() => _accepting = value),
                ),
                TextField(
                  key: const Key('max-party'),
                  controller: _party,
                  decoration: InputDecoration(labelText: l10n.maxParty),
                ),
                TextField(
                  key: const Key('notice-minutes'),
                  controller: _notice,
                  decoration: InputDecoration(labelText: l10n.minimumNotice),
                ),
                AppButton(
                  key: const Key('save-options'),
                  label: l10n.saveSettings,
                  onPressed: _saveOptions,
                ),
                if (state.result == 'saved')
                  Text(l10n.settingsSaved, key: const Key('settings-saved')),
                Text(l10n.replyHours),
                TextField(
                  key: const Key('reply-weekday'),
                  controller: _weekday,
                  decoration: InputDecoration(labelText: l10n.weekday),
                ),
                TextField(
                  key: const Key('reply-opens'),
                  controller: _opens,
                  decoration: InputDecoration(labelText: l10n.opens),
                ),
                TextField(
                  key: const Key('reply-closes'),
                  controller: _closes,
                  decoration: InputDecoration(labelText: l10n.closes),
                ),
                AppButton(
                  key: const Key('add-reply-hour'),
                  label: l10n.addReplyHours,
                  onPressed: _addReplyHour,
                ),
                ...?settings?.replyHours.map(
                  (ReplyHour hour) => ListTile(
                    key: Key('reply-${hour.id}'),
                    title: Text('${hour.weekday} ${hour.opens}–${hour.closes}'),
                    trailing: hour.id == null
                        ? null
                        : TextButton(
                            key: Key('remove-reply-${hour.id}'),
                            onPressed: () => widget.bloc.add(
                              ReplyHourRemoved(
                                placeId: widget.placeId,
                                id: hour.id!,
                              ),
                            ),
                            child: Text(l10n.removeItem),
                          ),
                  ),
                ),
                Text(l10n.closedPeriods),
                TextField(
                  key: const Key('closure-start'),
                  controller: _start,
                  decoration: InputDecoration(labelText: l10n.closureStart),
                ),
                TextField(
                  key: const Key('closure-end'),
                  controller: _end,
                  decoration: InputDecoration(labelText: l10n.closureEnd),
                ),
                TextField(
                  key: const Key('closure-reason'),
                  controller: _closureReason,
                  decoration: InputDecoration(labelText: l10n.exitReason),
                ),
                AppButton(
                  key: const Key('add-closure'),
                  label: l10n.addClosedPeriod,
                  onPressed: _addClosure,
                ),
                ...?settings?.closures.map(
                  (BookingClosure closure) => ListTile(
                    key: Key('closure-${closure.id}'),
                    title: Text(closure.reason ?? ''),
                    trailing: closure.id == null
                        ? null
                        : TextButton(
                            key: Key('remove-closure-${closure.id}'),
                            onPressed: () => widget.bloc.add(
                              ClosureRemoved(
                                placeId: widget.placeId,
                                id: closure.id!,
                              ),
                            ),
                            child: Text(l10n.removeItem),
                          ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _seed(PlaceBookingSettings? settings) {
    if (_seeded || settings == null) {
      return;
    }
    _seeded = true;
    _accepting = settings.options.accepting;
    _party.text = '${settings.options.maxParty}';
    _notice.text = '${settings.options.minimumNoticeMinutes}';
  }

  void _saveOptions() {
    widget.bloc.add(
      BookingOptionsSubmitted(
        placeId: widget.placeId,
        accepting: _accepting,
        maxParty: int.tryParse(_party.text.trim()) ?? 0,
        minimumNoticeMinutes: int.tryParse(_notice.text.trim()) ?? -1,
      ),
    );
  }

  void _addReplyHour() {
    widget.bloc.add(
      ReplyHourSubmitted(
        placeId: widget.placeId,
        weekday: int.tryParse(_weekday.text.trim()) ?? -1,
        opens: _opens.text.trim(),
        closes: _closes.text.trim(),
      ),
    );
  }

  void _addClosure() {
    final DateTime? startsAt = DateTime.tryParse(_start.text.trim());
    final DateTime? endsAt = DateTime.tryParse(_end.text.trim());
    if (startsAt == null || endsAt == null) {
      return;
    }
    widget.bloc.add(
      ClosureSubmitted(
        placeId: widget.placeId,
        startsAt: startsAt,
        endsAt: endsAt,
        reason: _closureReason.text,
      ),
    );
  }
}
