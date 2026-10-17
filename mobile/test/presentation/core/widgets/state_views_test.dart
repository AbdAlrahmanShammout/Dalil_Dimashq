import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:dalil_dimashq/core/theme/app_theme.dart';
import 'package:dalil_dimashq/presentation/core/widgets/empty_view.dart';
import 'package:dalil_dimashq/presentation/core/widgets/error_view.dart';
import 'package:dalil_dimashq/presentation/core/widgets/loading_view.dart';

void main() {
  testWidgets('loading, empty, and error views render on their own', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: AppTheme.dark, home: const LoadingView()),
    );
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.dark,
        home: const EmptyView(message: 'Nothing here'),
      ),
    );
    expect(find.text('Nothing here'), findsOneWidget);
    var retried = false;
    await tester.pumpWidget(
      MaterialApp(
        theme: AppTheme.dark,
        home: ErrorView(
          message: 'Failed',
          retryLabel: 'Retry',
          onRetry: () => retried = true,
        ),
      ),
    );
    await tester.tap(find.text('Retry'));
    expect(retried, isTrue);
  });
}
