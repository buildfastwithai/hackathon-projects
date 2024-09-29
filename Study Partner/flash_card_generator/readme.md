
# Flashcard App

This is a simple Flashcard Application built with React, which allows users to create flashcards, view them, and toggle between the term and definition. It also enables navigation through multiple flashcards.

## Features

- **Add New Flashcards**: Users can add a term and its corresponding definition to the flashcard list.
- **View Flashcards**: Users can toggle between viewing the term or its definition.
- **Next Card Navigation**: Users can move to the next flashcard in the list.

## How it Works

The app is composed of a few main components:

1. **Flashcard Display**: Shows the current flashcard, which can either display the term or the definition.
2. **Flashcard Input Form**: Allows the user to add a new flashcard by inputting both the term and its definition.
3. **Next Button**: Cycles through the flashcards.
4. **Toggle Button**: Allows the user to flip between showing the term or the definition of the current flashcard.

## Installation and Setup

To run this app locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd flashcard-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the app.

## Component Breakdown

### 1. FlashcardApp

This is the main component of the application. It manages the state and logic for adding and displaying flashcards.

**State Variables:**
- `cards`: An array that holds all flashcards (each card is an object with term and definition properties).
- `currentCard`: Keeps track of the index of the currently displayed flashcard.
- `showAnswer`: Boolean to track whether the definition is being displayed or the term.
- `newTerm` and `newDefinition`: State variables for capturing user input when adding a new flashcard.

**Functions:**
- `addCard`: Adds a new flashcard to the list based on the current values of `newTerm` and `newDefinition`.
- `nextCard`: Moves to the next flashcard in the list. If the current card is the last one, it cycles back to the first card.
- `setShowAnswer`: Toggles between displaying the term and the definition of the current flashcard.

### 2. Card Component (from `@/components/ui/card`)

This component is used to display each flashcard. It shows either the term or the definition depending on the value of `showAnswer`.

### 3. Button Component (from `@/components/ui/button`)

Used for the two main interactions:
- **Toggle Button**: Toggles between showing the term and definition of the current flashcard.
- **Next Button**: Moves to the next flashcard.

### 4. Input Component (from `@/components/ui/input`)

Used for the user to input the term and definition when adding new flashcards.

## Usage

### Adding Flashcards:
1. Type a term into the "Enter term" field.
2. Type a definition into the "Enter definition" field.
3. Press the "Add Flashcard" button to add it to the list.

### Navigating Flashcards:
- Once you have added at least one flashcard, it will be displayed in the flashcard area.
- Press the "Show Definition" button to view the definition.
- Press the "Next Card" button to cycle through the flashcards.

### Example
- **Adding a Flashcard:**
  - Term: "React"
  - Definition: "A JavaScript library for building user interfaces"
  
- **Viewing the Flashcard:**
  - When "Show Definition" is clicked, the definition ("A JavaScript library for building user interfaces") is displayed.
  - Clicking "Show Term" will revert back to showing the term ("React").

- **Navigating:**
  - You can add multiple cards and use the "Next Card" button to navigate through them. The cards will loop when the end of the list is reached.

## Technologies Used

- **React**: Front-end JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling the components.
- **Custom UI Components**: Pre-built UI components like Card, Button, and Input are used for a cleaner and more modular approach.

## Future Improvements

- **Flashcard Deletion**: Add functionality to delete a flashcard.
- **Edit Flashcard**: Add the ability to edit existing flashcards.
- **Shuffle Mode**: Implement a shuffle option to randomize the order of flashcards.

## License

This project is open source and available under the MIT License.
