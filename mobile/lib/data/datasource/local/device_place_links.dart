import 'package:flutter/services.dart';
import 'package:dalil_dimashq/domain/services/place_links.dart';
import 'package:injectable/injectable.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

@LazySingleton(as: PlaceLinks)
class DevicePlaceLinks implements PlaceLinks {
  @override
  Future<void> call(String phone) async {
    await launchUrl(Uri.parse('tel:$phone'));
  }

  @override
  Future<void> openDirections({
    required double latitude,
    required double longitude,
  }) async {
    final Uri uri = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=$latitude,$longitude',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Future<void> share(String text) async {
    await SharePlus.instance.share(ShareParams(text: text));
  }

  @override
  Future<void> copyPhone(String phone) async {
    await Clipboard.setData(ClipboardData(text: phone));
  }
}
