import 'package:flutter/material.dart';
import 'package:preception/home_screen.dart';
import 'package:preception/splash_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark, // Dark theme for Netflix look
      ),
      // home: FileUploadScreen(),
      initialRoute: '/',
      routes: {
        '/': (context) => SplashScreen(), // Splash screen as the initial screen
        '/home': (context) => FileUploadScreen(), // Main screen after splash
      },
    );
  }
}
