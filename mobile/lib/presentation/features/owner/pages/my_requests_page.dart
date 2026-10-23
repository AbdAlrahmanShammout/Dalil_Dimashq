import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/domain/entities/place_change_request.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/owner/bloc/my_requests_bloc.dart';

class MyRequestsPage extends StatelessWidget {
  const MyRequestsPage({
    required this.placeId,
    required this.bloc,
    super.key,
  });

  final String placeId;
  final MyRequestsBloc bloc;

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    return BlocProvider<MyRequestsBloc>.value(
      value: bloc..add(MyRequestsStarted(placeId)),
      child: AppScaffold(
        title: l10n.ownerRequests,
        body: BlocBuilder<MyRequestsBloc, MyRequestsState>(
          builder: (BuildContext context, MyRequestsState state) {
            return ListView(
              children: state.requests.map((PlaceChangeRequest request) {
                return ListTile(
                  key: Key('request-${request.id}'),
                  title: Text(_status(l10n, request.status)),
                  subtitle: Text(request.decisionNote ?? ''),
                );
              }).toList(growable: false),
            );
          },
        ),
      ),
    );
  }

  String _status(AppLocalizations l10n, String status) {
    switch (status) {
      case 'approved':
        return l10n.requestAccepted;
      case 'rejected':
        return l10n.requestRejected;
      default:
        return l10n.requestPending;
    }
  }
}
