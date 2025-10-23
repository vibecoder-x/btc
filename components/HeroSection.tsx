'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Block {
  id: number;
  x: number;
  y: number;
  height: number;
  opacity: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  yTarget: number;
  opacityTarget: number;
  duration: number;
}

export default function HeroSection() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize blocks that span across the screen width
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const blockCount = Math.ceil(screenWidth / 80) + 2; // Ensure full coverage

    const initialBlocks = Array.from({ length: blockCount }, (_, i) => ({
      id: i,
      x: i * 80,
      y: Math.random() * 500,
      height: Math.random() * 150 + 50,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setBlocks(initialBlocks);

    // Initialize particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * screenWidth,
      y: Math.random() * 500,
      opacity: Math.random(),
      yTarget: Math.random() * 500,
      opacityTarget: Math.random(),
      duration: Math.random() * 3 + 2,
    }));
    setParticles(initialParticles);

    // Animate blocks moving up and down
    const interval = setInterval(() => {
      setBlocks((prev) =>
        prev.map((block) => {
          const newY = block.y + (Math.random() - 0.5) * 3;
          return {
            ...block,
            y: Math.max(0, Math.min(500, newY)), // Keep within bounds
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full h-[500px] overflow-hidden bg-gradient-to-b from-space-black via-dark-gray to-medium-gray">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-orange bg-clip-text text-transparent text-center">
            Bitcoin Explorer
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 text-center max-w-3xl">
            Real-time blockchain visualization and analytics
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gradient-to-b from-space-black via-dark-gray to-medium-gray">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Particle effects */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: particle.opacity,
            }}
            animate={{
              y: [null, particle.yTarget],
              opacity: [null, particle.opacityTarget],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-neon-blue to-neon-orange bg-clip-text text-transparent text-center"
        >
          Bitcoin Explorer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground/70 text-center max-w-3xl"
        >
          Real-time blockchain visualization and analytics
        </motion.p>
      </div>

      {/* Glow effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
}
