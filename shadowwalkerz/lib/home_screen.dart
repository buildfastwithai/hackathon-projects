import 'dart:io';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:file_picker/file_picker.dart';
import 'package:path/path.dart';
import 'package:preception/chat_screen.dart';
import 'package:preception/constants.dart';
import 'package:preception/file_screen.dart';
import 'package:preception/quiz_screen.dart';
import 'package:preception/video_screen.dart'; // To extract file name

class FileUploadScreen extends StatefulWidget {
  @override
  _FileUploadScreenState createState() => _FileUploadScreenState();
}

class _FileUploadScreenState extends State<FileUploadScreen> {
  File? selectedFile;
  String uploadMessage = "";
  bool isUploading = false; // To track file upload status
  bool isFileUploaded = false; // To check if file is uploaded

  // Function to pick a PDF file
  Future<void> pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null) {
      setState(() {
        selectedFile = File(result.files.single.path!);
        isFileUploaded = false; // Reset after selecting a new file
      });
    }
  }

  // Function to upload the PDF file
  Future<void> uploadFile() async {
    if (selectedFile == null) {
      setState(() {
        uploadMessage = "No file selected!";
      });
      return;
    }

    setState(() {
      isUploading = true;
      uploadMessage = "";
    });

    var request = http.MultipartRequest(
      'POST',
      Uri.parse('${baseUrl}/upload'), // Change this to your server URL
      // Uri.parse('http://192.168.1.133:5000/upload'), // Change this to your server URL
    );

    // Add the file to the request
    request.files.add(await http.MultipartFile.fromPath('pdf', selectedFile!.path));

    // Send the request and handle the response
    try {
      var response = await request.send();

      if (response.statusCode == 200) {
        setState(() {
          uploadMessage = "File uploaded successfully!";
          isFileUploaded = true; // Enable quiz button
        });
      } else {
        setState(() {
          uploadMessage = "File upload failed with status: ${response.statusCode}";
        });
      }
    } catch (e) {
      setState(() {
        uploadMessage = "File upload failed: $e";
      });
    } finally {
      setState(() {
        isUploading = false;
      });
    }
  }

  // Function to navigate to the quiz screen
  void navigateToQuizScreen(BuildContext context) {
    if (isFileUploaded) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => QuizScreen()),
      );
    }
  }

  // Function to navigate to the file check screen
void navigateToFileCheckScreen(BuildContext context) {
  if (isFileUploaded) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => FileCheckScreen()),
    );
  }
}

  // Function to navigate to the file check screen
void navigateToVideoCheckScreen(BuildContext context) {
  if (isFileUploaded) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => VideoCheckScreen()),
    );
}
}

 // Function to navigate to the quiz screen
  void navigateToChatScreen(BuildContext context) {
    if (isFileUploaded) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => ChatScreen()),
      );
    }
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("PERCEPTION",style: TextStyle(color: Colors.red,fontWeight: FontWeight.w800),),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (isFileUploaded) // Show Quiz button only after file upload
                ElevatedButton(
                  onPressed: () => navigateToVideoCheckScreen(context), // Change this line
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      children: [
                        Icon(Icons.video_camera_back_outlined,size: 48,color: Colors.red),
                        Text("Video",style: TextStyle(color: Colors.red),)
                      ],
                    ),
                  ),
                ),
            SizedBox(height: 20,),
            if (selectedFile != null)
              Text("Selected File: ${basename(selectedFile!.path)}"),
            ElevatedButton(
              onPressed: pickFile,
              child: Text("Select PDF",style: TextStyle(color: Colors.red),),
            ),
            ElevatedButton(
              onPressed: isUploading ? null : uploadFile,
              child: isUploading ? CircularProgressIndicator() : Text("Upload PDF",style: TextStyle(color: Colors.red),),
            ),
            if (uploadMessage.isNotEmpty)
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  uploadMessage,
                  style: TextStyle(color: uploadMessage.contains('successfully') ? Colors.red : Colors.orange),
                ),
              ),
           Row(

          mainAxisAlignment: MainAxisAlignment.spaceAround,
          crossAxisAlignment: CrossAxisAlignment.center,
            children: [
               if (isFileUploaded) // Show Quiz button only after file upload
              ElevatedButton(
                onPressed: () => navigateToQuizScreen(context), // Passing context here
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      Icon(Icons.quiz,color: Colors.red,),
                    
                        Text("Quiz",style: TextStyle(color: Colors.red),)
                    ],
                  ),
                ),
              ),
            if (isFileUploaded) // Show Quiz button only after file upload
              ElevatedButton(
                
                onPressed: () => navigateToChatScreen(context), // Passing context here
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      Icon(Icons.chat,color: Colors.red),
                    
                        Text("Chat",style: TextStyle(color: Colors.red),)
                    ],
                  ),
                ),
              ),
              if (isFileUploaded) // Show Quiz button only after file upload
                ElevatedButton(
                  onPressed: () => navigateToFileCheckScreen(context), // Change this line
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      children: [
                        Icon(Icons.audio_file,color: Colors.red),
                        Text("Audio",style: TextStyle(color: Colors.red),)
                      ],
                    ),
                  ),
                ),
            ],
           )
          ],
        ),
      ),
    );
  }
}

