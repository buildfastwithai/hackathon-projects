import 'dart:async'; // To use Timer
import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:preception/constants.dart';

class FileCheckScreen extends StatefulWidget {
  @override
  _FileCheckScreenState createState() => _FileCheckScreenState();
}

class _FileCheckScreenState extends State<FileCheckScreen> {
  bool isLoading = true;
  bool filesExist = false;
  String file1Path = "";
  String file2Path = "";
  String fileText = "";
  late AudioPlayer audioPlayer;
  bool isPlaying = false;
  Duration currentPosition = Duration.zero;
  Duration totalDuration = Duration.zero;
  Timer? checkFilesTimer; // Timer for sending requests every 5 seconds

  @override
  void initState() {
    super.initState();
    audioPlayer = AudioPlayer();

    audioPlayer.onDurationChanged.listen((Duration d) {
      setState(() {
        totalDuration = d;
      });
    });

    audioPlayer.onPositionChanged.listen((Duration p) {
      setState(() {
        currentPosition = p;
      });
    });

    audioPlayer.onPlayerComplete.listen((event) {
      setState(() {
        isPlaying = false;
        currentPosition = Duration.zero;
      });
    });

    // Start checking for files every 5 seconds
    startFileCheck();
  }

  @override
  void dispose() {
    // Cancel the timer if the widget is disposed
    checkFilesTimer?.cancel();
    super.dispose();
  }

  // Function to check for files every 5 seconds
  void startFileCheck() {
    checkFiles(); // Initial check
    checkFilesTimer = Timer.periodic(Duration(seconds: 5), (timer) {
      checkFiles(); // Re-check files every 5 seconds
    });
  }

  // Function to check if files exist
  Future<void> checkFiles() async {
    try {
      final response = await http.get(Uri.parse('${baseUrl}/check-files'));

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);

        if (jsonResponse['files_exist'] == true) {
          setState(() {
            filesExist = true;
          });

          // Stop the periodic check if files are found
          checkFilesTimer?.cancel();

          // Download the files
          await downloadFiles(jsonResponse['file1'], jsonResponse['file2']);
        } else {
          setState(() {
            filesExist = false;
          });
        }
      } else {
        Fluttertoast.showToast(msg: 'Failed to check files');
      }
    } catch (e) {
      Fluttertoast.showToast(msg: 'Error: $e');
    }
  }

  // Function to download files
  Future<void> downloadFiles(String file1, String file2) async {
    final url1 = '${baseUrl}/download/${file1}';
    final url2 = '${baseUrl}/download/${file2}';

    final directory = await getApplicationDocumentsDirectory();

    // Download text file
    final response1 = await http.get(Uri.parse(url1));
    if (response1.statusCode == 200) {
      final localFile1 = File('${directory.path}/$file1');
      await localFile1.writeAsBytes(response1.bodyBytes);
      setState(() {
        file1Path = localFile1.path;
      });
      await readTextFile(file1Path);
    } else {
      Fluttertoast.showToast(msg: 'Failed to download text file');
    }

    // Download audio file
    final response2 = await http.get(Uri.parse(url2));
    if (response2.statusCode == 200) {
      final localFile2 = File('${directory.path}/$file2');
      await localFile2.writeAsBytes(response2.bodyBytes);
      setState(() {
        file2Path = localFile2.path;
      });
    } else {
      Fluttertoast.showToast(msg: 'Failed to download audio file');
    }

    // Stop showing loading after file download
    setState(() {
      isLoading = false;
    });
  }

  // Function to read text file
  Future<void> readTextFile(String path) async {
    try {
      final file = File(path);
      String content = await file.readAsString();
      setState(() {
        fileText = content;
      });
    } catch (e) {
      Fluttertoast.showToast(msg: 'Failed to read text file');
    }
  }

  // Function to play/pause the audio file
  void togglePlayPause() async {
    if (file2Path.isNotEmpty) {
      if (isPlaying) {
        await audioPlayer.pause();
      } else {
        await audioPlayer.play(DeviceFileSource(file2Path));
      }
      setState(() {
        isPlaying = !isPlaying;
      });
    } else {
      Fluttertoast.showToast(msg: 'Audio file not available');
    }
  }

  // Function to stop the audio
  void stopAudio() async {
    await audioPlayer.stop();
    setState(() {
      isPlaying = false;
      currentPosition = Duration.zero;
    });
  }

  String formatDuration(Duration d) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    return "${twoDigits(d.inMinutes)}:${twoDigits(d.inSeconds.remainder(60))}";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Checking Files')),
      body: Center(
        child: isLoading
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 20),
                  Text('Checking for files... Please wait.'), // Show loading text
                ],
              )
            : filesExist
                ? SingleChildScrollView(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Files are available!'),
                        SizedBox(height: 20),
                        Column(
                          children: [
                            Text('${formatDuration(currentPosition)} / ${formatDuration(totalDuration)}'),
                            Slider(
                              value: currentPosition.inSeconds.toDouble(),
                              max: totalDuration.inSeconds.toDouble(),
                              onChanged: (value) async {
                                final newPosition = Duration(seconds: value.toInt());
                                await audioPlayer.seek(newPosition);
                                setState(() {
                                  currentPosition = newPosition;
                                });
                              },
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                IconButton(
                                  icon: Icon(isPlaying ? Icons.pause : Icons.play_arrow),
                                  onPressed: togglePlayPause,
                                  iconSize: 20,
                                ),
                                IconButton(
                                  icon: Icon(Icons.stop),
                                  onPressed: stopAudio,
                                  iconSize: 20,
                                ),
                              ],
                            ),
                            SizedBox(height: 20),
                            if (fileText.isNotEmpty)
                              Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Text(fileText), // Display text content
                              ),
                          ],
                        ),
                      ],
                    ),
                  )
                : Text('Files are not available!'),
      ),
    );
  }
}
