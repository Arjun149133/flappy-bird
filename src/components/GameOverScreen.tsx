
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('flappyHighScore')) || 0);

  useEffect(() => {
    if (score > highScore) {
      localStorage.setItem('flappyHighScore', score.toString());
      setHighScore(score);
    }
  }, [score, highScore])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        onRestart();
      }
    }
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onRestart]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl border-4 border-red-500 animate-scale-in">
        <div className="text-6xl mb-4">💥</div>
        <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
        <div className="text-xl text-gray-700 mb-2">Final Score</div>
        <div className="text-4xl font-bold text-yellow-600 mb-6">{score}</div>
        <div className="text-xl text-gray-700 mb-2">High Score</div>
        <div className="text-4xl font-bold text-yellow-600 mb-6">{highScore}</div>
        <Button 
          onClick={onRestart}
          className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 rounded-lg transition-colors duration-200"
        >
          Play Again
        </Button>
        <div className="text-sm text-gray-500 mt-4">
          Click or press SPACE to flap
        </div>
      </div>
    </div>
  );
};
