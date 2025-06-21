
import React from 'react';

interface PipeProps {
  x: number;
  height: number;
  gap: number;
}

export const Pipe: React.FC<PipeProps> = ({ x, height, gap }) => {
  return (
    <>
      <div
        className="absolute bg-gradient-to-r from-green-600 to-green-500 border-l-2 border-r-2 border-green-800"
        style={{
          left: x,
          top: 0,
          width: 60,
          height: height,
        }}
      >
        <div
          className="absolute bottom-0 bg-gradient-to-r from-green-700 to-green-600 border-2 border-green-900"
          style={{
            left: -5,
            width: 70,
            height: 30,
          }}
        ></div>
      </div>

      <div
        className="absolute bg-gradient-to-r from-green-600 to-green-500 border-l-2 border-r-2 border-green-800"
        style={{
          left: x,
          top: height + gap,
          width: 60,
          height: 600 - height - gap,
        }}
      >
        <div
          className="absolute top-0 bg-gradient-to-r from-green-700 to-green-600 border-2 border-green-900"
          style={{
            left: -5,
            width: 70,
            height: 30,
          }}
        ></div>
      </div>
    </>
  );
};
