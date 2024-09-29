import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FlashcardApp = () => {
  const [cards, setCards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');

  const addCard = () => {
    if (newTerm && newDefinition) {
      setCards([...cards, { term: newTerm, definition: newDefinition }]);
      setNewTerm('');
      setNewDefinition('');
    }
  };

  const nextCard = () => {
    setCurrentCard((currentCard + 1) % cards.length);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Flashcard App</h1>
      <div className="mb-4">
        <Input
          type="text"
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
          placeholder="Enter term"
          className="mb-2"
        />
        <Input
          type="text"
          value={newDefinition}
          onChange={(e) => setNewDefinition(e.target.value)}
          placeholder="Enter definition"
          className="mb-2"
        />
        <Button onClick={addCard}>Add Flashcard</Button>
      </div>
      {cards.length > 0 && (
        <Card className="w-64 h-40 mx-auto">
          <CardContent className="flex items-center justify-center h-full">
            {showAnswer ? cards[currentCard].definition : cards[currentCard].term}
          </CardContent>
        </Card>
      )}
      <div className="mt-4 flex justify-center space-x-2">
        <Button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? 'Show Term' : 'Show Definition'}
        </Button>
        <Button onClick={nextCard}>Next Card</Button>
      </div>
    </div>
  );
};

export default FlashcardApp;
