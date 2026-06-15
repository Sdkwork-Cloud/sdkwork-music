import 'package:flutter/material.dart';
import '../models/music.dart';
import 'shelf_item.dart';

class ShelfList extends StatelessWidget {
  final List<MusicHomeShelf> shelves;

  const ShelfList({super.key, required this.shelves});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: shelves.length,
      itemBuilder: (context, index) {
        return ShelfItem(shelf: shelves[index]);
      },
    );
  }
}
