import 'package:flutter/material.dart';
import 'auth_gate.dart';
import 'screens/home_screen.dart';

class MusicApp extends StatelessWidget {
  const MusicApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SDKWork Music',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const AuthGate(
        child: HomeScreen(),
      ),
    );
  }
}
