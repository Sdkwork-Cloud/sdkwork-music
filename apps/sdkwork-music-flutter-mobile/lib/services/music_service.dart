import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/music.dart';

class MusicService {
  static const String _baseUrl = 'http://127.0.0.1:18080';
  static const String _appApiPrefix = '/app/v3/api';

  Future<List<MusicHomeShelf>> getHomeShelves({
    String? cursor,
    int? limit,
  }) async {
    final queryParams = <String, String>{};
    if (cursor != null) queryParams['cursor'] = cursor;
    if (limit != null) queryParams['limit'] = limit.toString();

    final uri = Uri.parse('$_baseUrl$_appApiPrefix/music/home/shelves')
        .replace(queryParameters: queryParams);

    final response = await http.get(
      uri,
      headers: {
        'Authorization': 'Bearer ${_getAccessToken()}',
        'Access-Token': _getAccessToken(),
      },
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch home shelves: ${response.statusCode}');
    }

    final List<dynamic> jsonList = json.decode(response.body);
    return jsonList
        .map((json) => MusicHomeShelf.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  String _getAccessToken() {
    // TODO: Get access token from auth context
    return '';
  }
}

final musicService = MusicService();
