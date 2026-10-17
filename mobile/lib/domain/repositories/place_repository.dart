import 'package:dartz/dartz.dart';
import 'package:dalil_dimashq/domain/entities/area.dart';
import 'package:dalil_dimashq/domain/entities/place_detail.dart';
import 'package:dalil_dimashq/domain/entities/place_search_page.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:dalil_dimashq/domain/failures/failure.dart';

abstract class PlaceRepository {
  Future<Either<Failure, PlaceSearchPage>> search(PlaceSearchQuery query);

  Future<Either<Failure, List<Area>>> areas();

  Future<Either<Failure, PlaceDetail>> getPlace(String id);
}
