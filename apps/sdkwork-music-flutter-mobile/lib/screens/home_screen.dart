import 'package:flutter/material.dart';
import '../models/music.dart';
import '../services/music_service.dart';
import '../widgets/shelf_list.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<MusicHomeShelf> _shelves = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadShelves();
  }

  Future<void> _loadShelves() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      final shelves = await musicService.getHomeShelves();
      setState(() {
        _shelves = shelves;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('SDKWork Music'),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(_error!),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadShelves,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_shelves.isEmpty) {
      return const Center(
        child: Text('No recommendations available'),
      );
    }

    return ShelfList(shelves: _shelves);
  }
}
