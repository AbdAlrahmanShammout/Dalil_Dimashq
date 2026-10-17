import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/domain/entities/place_photo.dart';
import 'package:dalil_dimashq/presentation/features/place/pages/gallery_page.dart';

void main() {
  testWidgets('gallery photos swipe and zoom', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: GalleryPage(
          initialIndex: 0,
          photos: <PlacePhoto>[
            PlacePhoto(id: 1, storagePath: 'front.jpg'),
            PlacePhoto(id: 2, storagePath: 'back.jpg'),
          ],
        ),
      ),
    );
    expect(find.byType(InteractiveViewer), findsOneWidget);
    expect(find.text('front.jpg'), findsOneWidget);
    await tester.drag(find.byType(PageView), const Offset(-500, 0));
    await tester.pumpAndSettle();
    expect(find.text('back.jpg'), findsOneWidget);
    expect(find.byKey(const Key('gallery-zoom-2')), findsOneWidget);
  });
}
