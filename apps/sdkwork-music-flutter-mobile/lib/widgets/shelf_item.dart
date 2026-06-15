import 'package:flutter/material.dart';
import '../models/music.dart';
import 'track_card.dart';
import 'playlist_card.dart';

class ShelfItem extends StatelessWidget {
  final MusicHomeShelf shelf;

  const ShelfItem({super.key, required this.shelf});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                shelf.title,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              Chip(
                label: Text(shelf.shelfType),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: shelf.items.length,
            itemBuilder: (context, index) {
              final item = shelf.items[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: _buildItemCard(item),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildItemCard(MusicRecommendationItem item) {
    if (item.itemType == 'track' && item.track != null) {
      return TrackCard(track: item.track!);
    } else if (item.itemType == 'playlist' && item.playlist != null) {
      return PlaylistCard(playlist: item.playlist!);
    }
    return const SizedBox.shrink();
  }
}
