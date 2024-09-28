import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:preception/constants.dart';
import 'score_screen.dart';

class QuizScreen extends StatefulWidget {
  @override
  _QuizScreenState createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  List<dynamic> _mcqs = [];
  int _currentQuestionIndex = 0;
  String? _selectedOption;
  List<Map<String, dynamic>> _userAnswers = [];
  // String baseUrl = 'http://192.168.43.215:5000';

  @override
  void initState() {
    super.initState();
    _fetchMCQs();
  }

  Future<void> _fetchMCQs() async {
    var response = await http.get(Uri.parse('${baseUrl}/get_mcqs'));

    if (response.statusCode == 200) {
      setState(() {
        _mcqs = json.decode(response.body);
      });
    } else {
      print('Failed to fetch MCQs: ${response.body}');
    }
  }

  void _submitAnswer() {
    if (_selectedOption == null) {
      // Show an alert if no option is selected
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Please select an answer!'),
      ));
      return;
    }

    _userAnswers.add({
      'question_id': _mcqs[_currentQuestionIndex]['id'],
      'selected_option':"Answer ${_selectedOption}"
    });

    if (_currentQuestionIndex < _mcqs.length - 1) {
      setState(() {
        _currentQuestionIndex++;
        _selectedOption = null; // Clear selected option for next question
      });
    } else {
      _submitAnswers();
    }
  }

  Future<void> _submitAnswers() async {
    var response = await http.post(
      Uri.parse('${baseUrl}/submit_answers'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({'answers': _userAnswers}),
    );

    if (response.statusCode == 200) {
      int score = json.decode(response.body)['score'];
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => ScoreScreen(score: score),
        ),
      );
    } else {
      print('Failed to submit answers: ${response.body}');
    }
  }

  List<String> _getOptions(dynamic options) {
    // If options are null or empty, return dummy options
    if (options == null || (options is List && options.isEmpty)) {
      return ['Dummy Option 1', 'Dummy Option 2', 'Dummy Option 3', 'Dummy Option 4'];
    } else {
      return List<String>.from(options);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_mcqs.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: Text('Quiz')),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    var currentQuestion = _mcqs[_currentQuestionIndex];
    var options = _getOptions(currentQuestion['options']); // Use dummy options if necessary

    return Scaffold(
      appBar: AppBar(title: Text('Quiz')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              'Question ${_currentQuestionIndex + 1}/${_mcqs.length}',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text(currentQuestion['question'], style: TextStyle(fontSize: 18)),
            ...options.map((option) {
              return RadioListTile(
                title: Text(option),
                value: option,
                groupValue: _selectedOption, // Manage selected answer
                onChanged: (value) {
                  setState(() {
                    _selectedOption = value.toString();
                  });
                },
              );
            }).toList(),
            SizedBox(height: 20),
            if (_currentQuestionIndex == _mcqs.length - 1)
              ElevatedButton(
                onPressed: _submitAnswer, // Submit quiz after the last question
                child: Text('Submit Quiz'),
              ),
            if (_currentQuestionIndex < _mcqs.length - 1)
              ElevatedButton(
                onPressed: _submitAnswer, // Next question button
                child: Text('Next Question'),
              ),
          ],
        ),
      ),
    );
  }
}
