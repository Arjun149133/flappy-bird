
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Bird } from './Bird';
import { Pipe } from './Pipe';
import { GameOverScreen } from './GameOverScreen';
import { ScoreBoard } from './ScoreBoard';
import { Particle } from './Particle';

interface PipeType {
  id: number;
  x: number;
  height: number;
  passed: boolean;
}

interface ParticleType {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const GAME_HEIGHT = 600;
const GAME_WIDTH = 400;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_SPEED = 3;

export const FlappyBird = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<PipeType[]>([]);
  const [score, setScore] = useState(0);
  const [particles, setParticles] = useState<ParticleType[]>([]);
  const gameLoopRef = useRef<number>();
  const lastPipeRef = useRef(0);

  const jump = useCallback(() => {
    if (gameState === 'menu') {
      setGameState('playing');
      setBirdVelocity(JUMP_FORCE);
    } else if (gameState === 'playing') {
      setBirdVelocity(JUMP_FORCE);
      const newParticles: ParticleType[] = [];
      for (let i = 0; i < 5; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: 80,
          y: birdY,
          vx: Math.random() * 4 - 2,
          vy: Math.random() * 4 - 2,
          life: 1
        });
      }
      setParticles(prev => [...prev, ...newParticles]);
    }
  }, [gameState, birdY]);

  const resetGame = () => {
    setGameState('menu');
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setParticles([]);
    lastPipeRef.current = 0;
  };

  const checkCollision = (birdY: number, pipes: PipeType[]) => {
    if (birdY <= 0 || birdY >= GAME_HEIGHT - BIRD_SIZE) {
      return true;
    }

    for (const pipe of pipes) {
      if (pipe.x < 80 + BIRD_SIZE && pipe.x + PIPE_WIDTH > 80) {
        if (birdY < pipe.height || birdY + BIRD_SIZE > pipe.height + PIPE_GAP) {
          return true;
        }
      }
    }
    return false;
  };

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    setBirdVelocity(prev => prev + GRAVITY);
    setBirdY(prev => {
      const newY = prev + birdVelocity;
      return Math.max(0, Math.min(GAME_HEIGHT - BIRD_SIZE, newY));
    });

    setPipes(prev => {
      let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        .filter(pipe => pipe.x > -PIPE_WIDTH);

      const now = Date.now();
      if (now - lastPipeRef.current > 1300) {
        const pipeHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
        newPipes.push({
          id: now,
          x: GAME_WIDTH,
          height: pipeHeight,
          passed: false
        });
        lastPipeRef.current = now;
      }

      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 80) {
          pipe.passed = true;
          setScore(prev => prev + 1);
        }
      });

      return newPipes;
    });

    setParticles(prev => prev.map(particle => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      life: particle.life - 0.02
    })).filter(particle => particle.life > 0));

    if (checkCollision(birdY + birdVelocity, pipes)) {
      setGameState('gameOver');
    }
  }, [gameState, birdVelocity, birdY, pipes]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 16) as unknown as number;
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [jump]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="relative">
        <div 
          className="relative overflow-hidden bg-gradient-to-b from-cyan-200 to-green-300 border-4 border-yellow-400 rounded-lg shadow-2xl"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-16 h-8 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-12 h-6 bg-white rounded-full"></div>
            <div className="absolute top-32 left-1/3 w-20 h-10 bg-white rounded-full"></div>
          </div>

          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-600 to-green-400"></div>

          {pipes.map(pipe => (
            <Pipe key={pipe.id} x={pipe.x} height={pipe.height} gap={PIPE_GAP} />
          ))}

          <Bird x={80} y={birdY} velocity={birdVelocity} />

          {particles.map(particle => (
            <Particle key={particle.id} particle={particle} />
          ))}

          <ScoreBoard score={score} gameState={gameState} />

          {gameState === 'menu' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4 text-yellow-300">Flappy Bird</h1>
                <p className="text-lg mb-4">Click or press SPACE to start!</p>
                <div className="animate-bounce">
                  <div className="text-2xl">🐦</div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'gameOver' && (
            <GameOverScreen score={score} onRestart={resetGame} />
          )}
        </div>
      </div>
    </div>
  );
};
