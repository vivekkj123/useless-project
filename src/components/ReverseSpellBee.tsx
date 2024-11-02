import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Heart, Lightbulb, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

const ReverseSpellBee = () => {
  const [word, setWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [challenge, setChallenge] = useState('');
  const [hint, setHint] = useState('');
  const [isMalayalam, setIsMalayalam] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  // Bilingual content
  const content = {
    english: {
      title: 'Reverse Spell Bee',
      subtitle: 'The game where spelling it right is wrong!',
      score: 'Score',
      lives: 'Lives',
      correctWord: 'Correct spelling',
      challenge: 'Challenge',
      submit: 'Submit',
      playAgain: 'Play Again',
      enterWord: 'Enter your misspelling...',
      gameOver: 'Game Over! Final Score',
      pleaseEnter: 'Please enter a word!',
      goodTry: 'Great misspelling! 🎉',
      tryAgain: 'Not quite what we were looking for! Try again.',
      words: [
        { word: 'beautiful', meaning: 'Attractive', hint: 'Try mixing vowels' },
        { word: 'necessary', meaning: 'Required', hint: 'Play with c and s' },
        { word: 'receive', meaning: 'Get', hint: 'i before e?' },
        { word: 'separate', meaning: 'Apart', hint: 'How many a\'s?' },
        { word: 'grammar', meaning: 'Language rules', hint: 'Double letters?' }
      ],
      challenges: [
        'Replace all vowels with the letter "e"',
        'Double every consonant',
        'Write it phonetically wrong',
        'Remove all vowels',
        'Reverse all vowel positions'
      ]
    },
    malayalam: {
      title: 'മലയാളം റിവേഴ്സ് സ്പെൽബീ',
      subtitle: 'ശരിയായി എഴുതുന്നത് തെറ്റാണ്!',
      score: 'സ്കോർ',
      lives: 'ജീവൻ',
      correctWord: 'ശരിയായ വാക്ക്',
      challenge: 'വെല്ലുവിളി',
      submit: 'സമർപ്പിക്കുക',
      playAgain: 'വീണ്ടും കളിക്കുക',
      enterWord: 'നിങ്ങളുടെ തെറ്റായ അക്ഷരവിന്യാസം നൽകുക...',
      gameOver: 'കളി കഴിഞ്ഞു! അവസാന സ്കോർ',
      pleaseEnter: 'ദയവായി ഒരു വാക്ക് നൽകുക!',
      goodTry: 'നല്ല തെറ്റായ അക്ഷരവിന്യാസം! 🎉',
      tryAgain: 'ശ്രമിക്കൂ! വീണ്ടും ശ്രമിക്കൂ!',
      words: [
        { word: 'കുട്ടി', meaning: 'Child', hint: 'Try mixing ട and റ്റ' },
        { word: 'സ്നേഹം', meaning: 'Love', hint: 'Mix up the vowel signs' },
        { word: 'വിദ്യാലയം', meaning: 'School', hint: 'Switch ദ്യ with ധ്യ' },
        { word: 'പൂച്ച', meaning: 'Cat', hint: 'Try using ച്ചു instead of ച്ച' },
        { word: 'മഴ', meaning: 'Rain', hint: 'Mix ഴ with ള' }
      ],
      challenges: [
        '"ട" മുതൽ "റ്റ" വരെ മാറ്റുക',
        'സ്വരചിഹ്നങ്ങൾ മാറ്റുക',
        'വ്യഞ്ജനങ്ങൾ ഇരട്ടിപ്പിക്കുക',
        'സമാന ശബ്ദമുള്ള അക്ഷരങ്ങൾ മാറ്റുക',
        'ചില്ലക്ഷരങ്ങൾ മാറ്റുക'
      ]
    }
  };

  const getCurrentContent = () => {
    return isMalayalam ? content.malayalam : content.english;
  };

  // Ensure a fresh challenge and word each time the language changes
  useEffect(() => {
    getRandomWord();
  }, [isMalayalam]);

  // Modified to ensure we get the right word and challenge for the current language
  const getRandomWord = () => {
    const currentContent = getCurrentContent();
    const words = currentContent.words;

    // Reset word index if we've shown all words
    if (currentWordIndex >= words.length - 1) {
      setCurrentWordIndex(-1);
    }

    // Get a new random word index that we haven't used yet
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * words.length);
    } while (newIndex === currentWordIndex);

    setCurrentWordIndex(newIndex);
    setWord(words[newIndex].word);
    setHint(words[newIndex].hint);

    // Choose a challenge specific to the current language
    const randomChallenge = currentContent.challenges[Math.floor(Math.random() * currentContent.challenges.length)];
    setChallenge(randomChallenge);

    setUserInput('');
    setMessage('');
  };


  const checkMisspelling = (input: string) => {
    if (!input || input === word) {
      return false;
    }

    // Ensure Malayalam input when in Malayalam mode
    if (isMalayalam && !/[\u0D00-\u0D7F]/.test(input)) {
      return false;
    }

    // Ensure English input when in English mode
    if (!isMalayalam && /[\u0D00-\u0D7F]/.test(input)) {
      return false;
    }

    const similarityThreshold = 0.4;
    let similarity = 0;
    const inputChars = Array.from(input);
    const wordChars = Array.from(word);

    inputChars.forEach((char) => {
      if (wordChars.includes(char)) {
        similarity++;
      }
    });

    return (similarity / Math.max(input.length, word.length)) >= similarityThreshold;
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentContent = getCurrentContent();
    
    if (!userInput) {
      setMessage(currentContent.pleaseEnter);
      return;
    }

    if (checkMisspelling(userInput)) {
      setScore(score + 1);
      setMessage(currentContent.goodTry);
      setTimeout(getRandomWord, 1500);
    } else {
      setLives(lives - 1);
      setMessage(currentContent.tryAgain);
      
      if (lives <= 1) {
        setGameOver(true);
        setMessage(`${currentContent.gameOver}: ${score}`);
      }
    }
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setCurrentWordIndex(-1);
    getRandomWord();
  };

  const handleLanguageToggle = () => {
    setIsMalayalam(!isMalayalam);
    setCurrentWordIndex(-1); // Reset word index when switching languages
    resetGame();
  };

  const showHint = () => {
    setMessage(hint);
  };

  useEffect(() => {
    getRandomWord();
  }, []);

  const currentContent = getCurrentContent();

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-4">
          <img className="h-10 w-auto" src="/logo.webp" alt="" />
          <CardTitle className="text-2xl font-bold">{currentContent.title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm">EN</span>
            <Switch
              checked={isMalayalam}
              onCheckedChange={handleLanguageToggle}
              className="data-[state=checked]:bg-blue-500"
            />
            <span className="text-sm">ML</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{currentContent.subtitle}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            <span>{currentContent.score}: {score}</span>
          </div>
          <div className="flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            <span>{currentContent.lives}: {lives}</span>
          </div>
        </div>

        {!gameOver ? (
          <>
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="font-medium">{currentContent.correctWord}: <span className="text-blue-600">{word}</span></p>
              <p className="text-sm mt-2">{currentContent.challenge}: <span className="text-purple-600">{challenge}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={currentContent.enterWord}
                className="w-full"
                disabled={gameOver}
              />
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  disabled={gameOver}
                >
                  {currentContent.submit}
                </Button>
                <Button 
                  type="button" 
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={showHint}
                  disabled={gameOver}
                >
                  <Lightbulb className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">{currentContent.gameOver}: {score}</p>
            <Button 
              onClick={resetGame}
              className="bg-green-500 hover:bg-green-600"
            >
              {currentContent.playAgain}
            </Button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded ${
            message.includes('Great') || message.includes('നല്ല') ? 'bg-green-100 text-green-700' : 
            message.includes('Game Over') || message.includes('കളി കഴിഞ്ഞു') ? 'bg-red-100 text-red-700' : 
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