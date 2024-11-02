import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trophy, Heart } from 'lucide-react';

const ReverseSpellBee = () => {
  const [word, setWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [challenge, setChallenge] = useState('');

  // Word bank with correct spellings
  const words = [
    'beautiful', 'necessary', 'receive', 'separate', 'definitely',
    'grammar', 'occurrence', 'embarrass', 'intelligence', 'possession',
    'thoroughly', 'beginning', 'conscious', 'immediately', 'particularly'
  ];

  // Different types of misspelling challenges
  const challenges = [
    'Replace all vowels with the letter "e"',
    'Double every consonant',
    'Write it phonetically wrong',
    'Remove all vowels',
    'Reverse all vowel positions'
  ];

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setWord(words[randomIndex]);
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    setUserInput('');
    setMessage('');
  };

  const checkMisspelling = (input) => {
    // The word must be different from the correct spelling
    if (input === word) {
      return false;
    }

    // Check if the misspelling follows the current challenge rules
    switch (challenge) {
      case 'Replace all vowels with the letter "e"':
        return /[aeiou]/i.test(word) && !/[aiou]/i.test(input) && input.length === word.length;
      
      case 'Double every consonant':
        const consonants = word.match(/[^aeiou]/gi) || [];
        return consonants.every(c => (input.match(new RegExp(c + c, 'gi')) || []).length > 0);
      
      case 'Remove all vowels':
        return !/[aeiou]/i.test(input) && input.length < word.length;
      
      case 'Write it phonetically wrong':
        // Must be different but maintain some similarity
        return input !== word && input.length >= word.length * 0.5;
      
      case 'Reverse all vowel positions':
        const originalVowels = word.match(/[aeiou]/gi) || [];
        const inputVowels = input.match(/[aeiou]/gi) || [];
        return originalVowels.length === inputVowels.length && 
               originalVowels.join('') !== inputVowels.join('');
      
      default:
        return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userInput) {
      setMessage('Please enter a word!');
      return;
    }

    if (checkMisspelling(userInput)) {
      setScore(score + 1);
      setMessage('Great misspelling! 🎉');
      setTimeout(getRandomWord, 1500);
    } else {
      setLives(lives - 1);
      setMessage('Not quite what we were looking for! Try again.');
      
      if (lives <= 1) {
        setGameOver(true);
        setMessage(`Game Over! Final score: ${score}`);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    getRandomWord();
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Reverse Spell Bee</CardTitle>
        <p className="text-sm text-gray-500">The game where spelling it right is wrong!</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            <span>Score: {score}</span>
          </div>
          <div className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            <span>Lives: {lives}</span>
          </div>
        </div>

        {!gameOver ? (
          <>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="font-medium">Correct spelling: <span className="text-blue-600">{word}</span></p>
              <p className="text-sm mt-2">Challenge: <span className="text-purple-600">{challenge}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your misspelling..."
                className="w-full"
                disabled={gameOver}
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={gameOver}
              >
                Submit
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Game Over! Final Score: {score}</p>
            <Button 
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-600"
            >
              Play Again
            </Button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('Great') ? 'bg-green-100 text-green-700' : 
            message.includes('Game Over') ? 'bg-red-100 text-red-700' : 
            'bg-yellow-100 text-yellow-700'
          }`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReverseSpellBee;