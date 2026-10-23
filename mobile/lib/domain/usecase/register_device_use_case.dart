import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/repositories/device_repository.dart';
import 'package:dalil_dimashq/domain/services/device_push_token.dart';
import 'package:injectable/injectable.dart';

@injectable
class RegisterDeviceUseCase {
  RegisterDeviceUseCase(this._repository, this._token);

  final DeviceRepository _repository;
  final DevicePushToken _token;

  Future<Either<Failure, void>> call() async {
    final String? token = await _token.read();
    if (token == null || token.isEmpty) {
      return const Right<Failure, void>(null);
    }
    final String platform = _token.platform;
    if (platform != 'android' && platform != 'ios') {
      return const Left<Failure, void>(ValidationFailure('platform'));
    }
    return _repository.register(token: token, platform: platform);
  }
}
