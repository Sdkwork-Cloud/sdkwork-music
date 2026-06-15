class MusicHomeShelf {
  final String id;
  final String tenantId;
  final String slug;
  final String title;
  final String shelfType;
  final List<MusicRecommendationItem> items;

  MusicHomeShelf({
    required this.id,
    required this.tenantId,
    required this.slug,
    required this.title,
    required this.shelfType,
    required this.items,
  });

  factory MusicHomeShelf.fromJson(Map<String, dynamic> json) {
    return MusicHomeShelf(
      id: json['id'] as String,
      tenantId: json['tenantId'] as String,
      slug: json['slug'] as String,
      title: json['title'] as String,
      shelfType: json['shelfType'] as String,
      items: (json['items'] as List<dynamic>)
          .map((item) => MusicRecommendationItem.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }
}

class MusicRecommendationItem {
  final String id;
  final String itemType;
  final String itemId;
  final int position;
  final String? reasonCode;
  final MusicTrack? track;
  final MusicPlaylist? playlist;

  MusicRecommendationItem({
    required this.id,
    required this.itemType,
    required this.itemId,
    required this.position,
    this.reasonCode,
    this.track,
    this.playlist,
  });

  factory MusicRecommendationItem.fromJson(Map<String, dynamic> json) {
    return MusicRecommendationItem(
      id: json['id'] as String,
      itemType: json['itemType'] as String,
      itemId: json['itemId'] as String,
      position: json['position'] as int,
      reasonCode: json['reasonCode'] as String?,
      track: json['track'] != null
          ? MusicTrack.fromJson(json['track'] as Map<String, dynamic>)
          : null,
      playlist: json['playlist'] != null
          ? MusicPlaylist.fromJson(json['playlist'] as Map<String, dynamic>)
          : null,
    );
  }
}

class MusicTrack {
  final String id;
  final String tenantId;
  final String artistId;
  final String? artistName;
  final String? albumId;
  final String? albumTitle;
  final String? audioAssetId;
  final MusicMediaResource? audio;
  final String slug;
  final String title;
  final int durationSeconds;
  final String status;
  final List<String>? tags;
  final String? publishedAt;

  MusicTrack({
    required this.id,
    required this.tenantId,
    required this.artistId,
    this.artistName,
    this.albumId,
    this.albumTitle,
    this.audioAssetId,
    this.audio,
    required this.slug,
    required this.title,
    required this.durationSeconds,
    required this.status,
    this.tags,
    this.publishedAt,
  });

  factory MusicTrack.fromJson(Map<String, dynamic> json) {
    return MusicTrack(
      id: json['id'] as String,
      tenantId: json['tenantId'] as String,
      artistId: json['artistId'] as String,
      artistName: json['artistName'] as String?,
      albumId: json['albumId'] as String?,
      albumTitle: json['albumTitle'] as String?,
      audioAssetId: json['audioAssetId'] as String?,
      audio: json['audio'] != null
          ? MusicMediaResource.fromJson(json['audio'] as Map<String, dynamic>)
          : null,
      slug: json['slug'] as String,
      title: json['title'] as String,
      durationSeconds: json['durationSeconds'] as int,
      status: json['status'] as String,
      tags: (json['tags'] as List<dynamic>?)?.map((tag) => tag as String).toList(),
      publishedAt: json['publishedAt'] as String?,
    );
  }
}

class MusicPlaylist {
  final String id;
  final String tenantId;
  final String slug;
  final String title;
  final String? description;
  final List<String>? trackIds;

  MusicPlaylist({
    required this.id,
    required this.tenantId,
    required this.slug,
    required this.title,
    this.description,
    this.trackIds,
  });

  factory MusicPlaylist.fromJson(Map<String, dynamic> json) {
    return MusicPlaylist(
      id: json['id'] as String,
      tenantId: json['tenantId'] as String,
      slug: json['slug'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      trackIds: (json['trackIds'] as List<dynamic>?)?.map((id) => id as String).toList(),
    );
  }
}

class MusicMediaResource {
  final String id;
  final String driveUri;
  final String mimeType;
  final int durationSeconds;

  MusicMediaResource({
    required this.id,
    required this.driveUri,
    required this.mimeType,
    required this.durationSeconds,
  });

  factory MusicMediaResource.fromJson(Map<String, dynamic> json) {
    return MusicMediaResource(
      id: json['id'] as String,
      driveUri: json['driveUri'] as String,
      mimeType: json['mimeType'] as String,
      durationSeconds: json['durationSeconds'] as int,
    );
  }
}
