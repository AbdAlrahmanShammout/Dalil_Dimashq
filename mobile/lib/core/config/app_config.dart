/// Compile-time app settings.
///
/// [supabaseUrl] is the project origin. API clients append `/rest/v1` and
/// `/auth/v1` themselves, so the origin must not include `/rest/v1`.
/// Override either value with `--dart-define`.
abstract final class AppConfig {
  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'staging',
  );
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://yynbjjwjrgssovsponvg.supabase.co',
  );
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bmJqandqcmdzc292c3BvbnZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0NTU0NDYsImV4cCI6MjEwNzAzMTQ0Nn0.tDE3chaK2_NAVxvWAYgb8iU4X25hNVSAkPD97wdP0VA',
  );
  static const Duration timeout = Duration(seconds: 30);
}
