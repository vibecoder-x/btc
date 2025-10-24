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
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#2D3436] to-[#0A0A0A]">
      {/* 3D Grid pattern background with gold accent */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center top'
      }}></div>

      {/* Particle effects with gold glow */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 107, 53, 0.4) 100%)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)'
            }}
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
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FF6B35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.5))',
            fontFamily: 'Poppins, Inter, sans-serif',
            letterSpacing: '-0.02em'
          }}
        >
          BTCindexer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center max-w-3xl mb-8"
          style={{
            color: '#E0E0E0',
            letterSpacing: '0.03em',
            lineHeight: '1.6'
          }}
        >
          Professional Bitcoin blockchain indexing and real-time analytics platform
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="px-8 py-4 rounded-2xl font-semibold text-lg gradient-gold-orange glow-gold hover:scale-105 transition-all duration-300 text-[#0A0A0A]">
            Try API
          </button>
          <button className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#0A0A0A] hover:glow-gold transition-all duration-300">
            View Docs
          </button>
        </motion.div>
      </div>

      {/* Glow effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
    </div>
  );
}
