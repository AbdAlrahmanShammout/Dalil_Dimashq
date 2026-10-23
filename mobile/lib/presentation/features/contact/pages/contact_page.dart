import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dalil_dimashq/core/di/injection.dart';
import 'package:dalil_dimashq/core/network/dalil_error_catalog.dart';
import 'package:dalil_dimashq/domain/entities/contact_message.dart';
import 'package:dalil_dimashq/l10n/generated/app_localizations.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_button.dart';
import 'package:dalil_dimashq/presentation/core/widgets/app_scaffold.dart';
import 'package:dalil_dimashq/presentation/features/contact/bloc/contact_bloc.dart';

class ContactPage extends StatelessWidget {
  const ContactPage({this.bloc, super.key});

  final ContactBloc? bloc;

  @override
  Widget build(BuildContext context) {
    if (bloc != null) {
      return BlocProvider<ContactBloc>.value(
        value: bloc!,
        child: const _ContactForm(),
      );
    }
    return BlocProvider<ContactBloc>(
      create: (BuildContext context) => getIt<ContactBloc>(),
      child: const _ContactForm(),
    );
  }
}

class _ContactForm extends StatefulWidget {
  const _ContactForm();

  @override
  State<_ContactForm> createState() => _ContactFormState();
}

class _ContactFormState extends State<_ContactForm> {
  final TextEditingController _name = TextEditingController();
  final TextEditingController _contact = TextEditingController();
  final TextEditingController _message = TextEditingController();
  String _type = ContactMessage.types.first;

  @override
  void dispose() {
    _name.dispose();
    _contact.dispose();
    _message.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AppLocalizations l10n = AppLocalizations.of(context);
    final String language = Localizations.localeOf(context).languageCode;
    return AppScaffold(
      title: l10n.contactUs,
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: BlocBuilder<ContactBloc, ContactState>(
          builder: (BuildContext context, ContactState state) {
            if (state.isSent) {
              return Text(
                l10n.contactSent,
                key: const Key('contact-sent'),
              );
            }
            return ListView(
              children: <Widget>[
                TextField(
                  key: const Key('contact-name'),
                  controller: _name,
                  decoration: InputDecoration(labelText: l10n.displayName),
                ),
                TextField(
                  key: const Key('contact-value'),
                  controller: _contact,
                  decoration: InputDecoration(labelText: l10n.contactValue),
                ),
                DropdownButton<String>(
                  key: const Key('contact-type'),
                  value: _type,
                  items: ContactMessage.types
                      .map(
                        (String type) => DropdownMenuItem<String>(
                          value: type,
                          child: Text(_label(l10n, type)),
                        ),
                      )
                      .toList(growable: false),
                  onChanged: (String? value) {
                    if (value == null) {
                      return;
                    }
                    setState(() => _type = value);
                  },
                ),
                TextField(
                  key: const Key('contact-message'),
                  controller: _message,
                  decoration: InputDecoration(labelText: l10n.message),
                ),
                const SizedBox(height: 12),
                AppButton(
                  label: l10n.send,
                  onPressed: () {
                    context.read<ContactBloc>().add(
                      ContactSubmitted(
                        ContactMessage(
                          name: _name.text,
                          contact: _contact.text,
                          type: _type,
                          message: _message.text,
                        ),
                      ),
                    );
                  },
                ),
                if (state.errorCode != null)
                  Text(_error(l10n, state.errorCode!, language)),
              ],
            );
          },
        ),
      ),
    );
  }

  String _label(AppLocalizations l10n, String type) {
    switch (type) {
      case 'add_facility':
        return l10n.contactTypeFacility;
      case 'partnership':
        return l10n.contactTypePartnership;
      case 'other':
        return l10n.contactTypeOther;
      default:
        return l10n.contactTypeGeneral;
    }
  }

  String _error(AppLocalizations l10n, String code, String language) {
    if (code == 'too_large') {
      return l10n.messageTooLarge;
    }
    if (code == 'rate_limited') {
      return l10n.contactRateLimited;
    }
    return dalilErrorText(code, language);
  }
}
