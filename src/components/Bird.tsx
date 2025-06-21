
import React from 'react';

interface BirdProps {
  x: number;
  y: number;
  velocity: number;
}

export const Bird: React.FC<BirdProps> = ({ x, y, velocity }) => {
  const rotation = Math.max(-30, Math.min(30, velocity * 3));

  return (
    <div
      className="absolute transition-transform duration-75 ease-out"
      style={{
        left: x,
        top: y,
        width: 30,
        height: 30,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className="relative w-full h-full">
        {/* Bird body */}
        <div className="absolute inset-0 bg-yellow-400 rounded-full border-2 border-orange-500">
          {/* Wing */}
          <div className="absolute top-1 right-1 w-4 h-3 bg-orange-400 rounded-full animate-pulse"></div>
          {/* Eye */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full"></div>
          </div>
          {/* Beak */}
          <div className="absolute top-3 -right-1 w-2 h-1 bg-orange-600 transform rotate-30"></div>
        </div>
      </div>
    </div>
  );
};
