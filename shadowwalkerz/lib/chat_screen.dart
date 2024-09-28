import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:preception/constants.dart';

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  List<Map<String, String>> messages = [];

  Future<void> _sendMessage(String message) async {
    final url = Uri.parse('${baseUrl}/ask'); // Change to your backend URL
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        'question': message,
        'pdf_filename': 'geah103.pdf', // Hardcoded PDF filename
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        messages.add({'user': message, 'bot': data['answer']});
      });
    } else {
      setState(() {
        messages.add({'user': message, 'bot': 'Error fetching response.'});
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('AI Chat')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text('You: ${messages[index]['user']}'),
                  subtitle: Text('AI: ${messages[index]['bot']}'),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(hintText: 'Ask a question...'),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: () {
                    final message = _controller.text;
                    _controller.clear();
                    if (message.isNotEmpty) {
                      _sendMessage(message); // Only sending the message
                    }
                  },
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
