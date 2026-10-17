abstract final class AppConfig {
  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'staging',
  );
  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
  );
  static const Duration timeout = Duration(seconds: 30);
}
