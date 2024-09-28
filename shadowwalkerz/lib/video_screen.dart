import 'dart:async';
import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:preception/constants.dart';
import 'package:video_player/video_player.dart';

class VideoCheckScreen extends StatefulWidget {
  @override
  _VideoCheckScreenState createState() => _VideoCheckScreenState();
}

class _VideoCheckScreenState extends State<VideoCheckScreen> {
  bool isLoading = true;
  bool filesExist = false;
  String videoPath = "";
  late VideoPlayerController _controller;
  Timer? checkFilesTimer; // Timer for sending requests every 5 seconds

  @override
  void initState() {
    super.initState();

    // Start checking for video file every 5 seconds
    startFileCheck();
  }

  @override
  void dispose() {
    _controller.dispose();
    checkFilesTimer?.cancel();
    super.dispose();
  }

  // Function to check for video file every 5 seconds
  void startFileCheck() {
    checkFiles(); // Initial check
    checkFilesTimer = Timer.periodic(Duration(seconds: 5), (timer) {
      checkFiles(); // Re-check video file every 5 seconds
    });
  }

  // Function to check if video file exists
  Future<void> checkFiles() async {
    try {
      final response = await http.get(Uri.parse('${baseUrl}/check-video'));

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        if (jsonResponse['files_exist'] == true) {
          setState(() {
            filesExist = true;
            videoPath = jsonResponse['video'];
          });
          // Stop the periodic check if video file is found
          checkFilesTimer?.cancel();

          // Download the video file
          await downloadVideo(videoPath);
        } else {
          setState(() {
            filesExist = false;
          });
        }
      } else {
        Fluttertoast.showToast(msg: 'Failed to check video file');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error: $e');
    }
  }

  // Function to download the video file
  Future<void> downloadVideo(String filename) async {
    final url = '${baseUrl}/download-video/$filename';
    final directory = await getApplicationDocumentsDirectory();

    // Download video file
    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final localFile = File('${directory.path}/$filename');
      await localFile.writeAsBytes(response.bodyBytes);

      if (await localFile.exists()) {
        setState(() {
          videoPath = localFile.path;
          isLoading = false; // Stop loading after download
        });

        // Initialize video player after confirming file exists
        _controller = VideoPlayerController.file(localFile)
          ..initialize().then((_) {
            setState(() {});
            _controller.play(); // Automatically start playing
          });
      } else {
        Fluttertoast.showToast(msg: 'Video file not found after download');
      }
    } else {
      Fluttertoast.showToast(msg: 'Failed to download video file');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Video Playback')),
      body: Center(
        child: isLoading
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 20),
                  Text('Checking for video... Please wait.'),
                ],
              )
            : filesExist
                ? Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _controller.value.isInitialized
                          ? FittedBox(
                              fit: BoxFit.contain,
                              child: SizedBox(
                                width: _controller.value.size.width ?? 0,
                                height: _controller.value.size.height ?? 0,
                                child: VideoPlayer(_controller),
                              ),
                            )
                          : Container(),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            _controller.value.isPlaying
                                ? _controller.pause()
                                : _controller.play();
                          });
                        },
                        child: Icon(
                          _controller.value.isPlaying
                              ? Icons.pause
                              : Icons.play_arrow,
                        ),
                      ),
                    ],
                  )
                : Text('Video file is not available!'),
      ),
    );
  }
}
