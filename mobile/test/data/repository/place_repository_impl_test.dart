import 'package:dalil_dimashq/data/datasource/remote/directory_api_client.dart';
import 'package:dalil_dimashq/data/datasource/remote/directory_remote_data_source.dart';
import 'package:dalil_dimashq/data/dto/place_summary_dto.dart';
import 'package:dalil_dimashq/data/dto/area_dto.dart';
import 'package:dalil_dimashq/data/dto/featured_now_dto.dart';
import 'package:dalil_dimashq/data/dto/amenity_dto.dart';
import 'package:dalil_dimashq/data/dto/offer_dto.dart';
import 'package:dalil_dimashq/data/dto/photo_dto.dart';
import 'package:dalil_dimashq/data/dto/place_row_dto.dart';
import 'package:dalil_dimashq/data/dto/search_places_request_dto.dart';
import 'package:dalil_dimashq/data/dto/search_places_response_dto.dart';
import 'package:dalil_dimashq/data/repository/place_repository_impl.dart';
import 'package:dalil_dimashq/domain/entities/place_search_query.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('search asks the server for one page', () async {
    final _FakeRemote remote = _FakeRemote();
    final PlaceRepositoryImpl repository = PlaceRepositoryImpl(remote);
    final result = await repository.search(
      const PlaceSearchQuery(text: '  sham  ', limit: 20, offset: 40),
    );
    expect(remote.lastRequest?.pQuery, 'sham');
    expect(remote.lastRequest?.pLimit, 20);
    expect(remote.lastRequest?.pOffset, 40);
    expect(result.isRight(), isTrue);
  });
}

class _FakeRemote extends DirectoryRemoteDataSource {
  _FakeRemote() : super(_UnusedClient());

  SearchPlacesRequestDto? lastRequest;

  @override
  Future<SearchPlacesResponseDto> search(SearchPlacesRequestDto request) async {
    lastRequest = request;
    return const SearchPlacesResponseDto(
      places: <PlaceSummaryDto>[
        PlaceSummaryDto(id: 'p1', type: 'cafe', nameAr: 'شام'),
      ],
      total: 1,
      countAll: 1,
      countHotels: 0,
      countRestaurants: 0,
      countCafes: 1,
    );
  }
}

class _UnusedClient implements DirectoryApiClient {
  @override
  Future<SearchPlacesResponseDto> searchPlaces(SearchPlacesRequestDto body) {
    throw UnimplementedError();
  }

  @override
  Future<List<AreaDto>> listAreas(String select) {
    throw UnimplementedError();
  }

  @override
  Future<List<PlaceRowDto>> places(String id, String select) {
    throw UnimplementedError();
  }

  @override
  Future<List<AreaDto>> areaById(String id, String select) {
    throw UnimplementedError();
  }

  @override
  Future<List<FeaturedNowDto>> featuredNow(String placeId) {
    throw UnimplementedError();
  }

  @override
  Future<List<PhotoDto>> photos(
    String placeId,
    String select,
    String orFilter,
    String hidden,
  ) {
    throw UnimplementedError();
  }

  @override
  Future<List<OfferDto>> offers(String placeId, String select) {
    throw UnimplementedError();
  }

  @override
  Future<List<PlaceAmenityDto>> placeAmenities(String placeId, String select) {
    throw UnimplementedError();
  }

  @override
  Future<List<AmenityDto>> amenities(String select) {
    throw UnimplementedError();
  }
}
