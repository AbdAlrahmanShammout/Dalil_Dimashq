import 'package:dartz/dartz.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';
import 'package:dalil_dimashq/domain/usecase/delete_account_use_case.dart';

abstract class DeleteAccountEvent {
  const DeleteAccountEvent();
}

class DeleteAccountRequested extends DeleteAccountEvent {
  const DeleteAccountRequested();
}

class DeleteAccountState {
  const DeleteAccountState({this.isDeleted = false, this.errorCode});

  final bool isDeleted;
  final String? errorCode;
}

@injectable
class DeleteAccountBloc extends Bloc<DeleteAccountEvent, DeleteAccountState> {
  DeleteAccountBloc(this._deleteAccount) : super(const DeleteAccountState()) {
    on<DeleteAccountRequested>(_onRequested);
  }

  final DeleteAccountUseCase _deleteAccount;

  Future<void> _onRequested(
    DeleteAccountRequested event,
    Emitter<DeleteAccountState> emit,
  ) async {
    final Either<Failure, void> result = await _deleteAccount();
    result.fold(
      (Failure failure) => emit(DeleteAccountState(errorCode: failure.message)),
      (_) => emit(const DeleteAccountState(isDeleted: true)),
    );
  }
}
