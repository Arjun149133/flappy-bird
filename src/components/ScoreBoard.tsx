
import React from 'react';

interface ScoreBoardProps {
  score: number;
  gameState: 'menu' | 'playing' | 'gameOver';
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, gameState }) => {
  if (gameState === 'menu') return null;

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-yellow-400 shadow-lg">
        <div className="text-3xl font-bold text-gray-800 text-center min-w-[3rem]">
          {score}
        </div>
      </div>
    </div>
  );
};
