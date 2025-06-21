
import React from 'react';

interface ParticleType {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface ParticleProps {
  particle: ParticleType;
}

export const Particle: React.FC<ParticleProps> = ({ particle }) => {
  return (
    <div
      className="absolute w-1 h-1 bg-yellow-300 rounded-full"
      style={{
        left: particle.x,
        top: particle.y,
        opacity: particle.life,
        transform: `scale(${particle.life})`,
      }}
    />
  );
};
