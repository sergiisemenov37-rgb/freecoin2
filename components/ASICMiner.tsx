"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Coin {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export default function ASICMiner({ minerPower = 0.2, minerLevel = 1 }: { minerPower?: number; minerLevel?: number }) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [hashRate, setHashRate] = useState(0);

  // Generate coins based on mining power
  useEffect(() => {
    if (!minerPower) return;

    const interval = setInterval(() => {
      const coinCount = Math.min(Math.floor(minerPower * 2), 3); // More power = more coins
      
      for (let i = 0; i < coinCount; i++) {
        const newCoin: Coin = {
          id: Date.now() + Math.random(),
          x: (Math.random() - 0.5) * 100,
          y: 0,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        };
        
        setCoins(prev => [...prev, newCoin]);
      }
    }, 800 / minerPower); // Higher power = faster generation

    return () => clearInterval(interval);
  }, [minerPower]);

  // Remove coins after animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(prev => prev.filter(coin => {
        const age = Date.now() - coin.id;
        return age < 2000; // Remove after 2 seconds
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Simulate hash rate display
  useEffect(() => {
    const interval = setInterval(() => {
      setHashRate(prev => {
        const base = minerPower * 100;
        const variance = (Math.random() - 0.5) * 20;
        return Math.max(0, base + variance);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [minerPower]);

  return (
    <div className="relative flex justify-center items-center py-8">
      {/* Green glow - intensity based on miner level */}
      <motion.div
        animate={{
          scale: [1, 1.05 + (minerLevel * 0.01), 1],
          opacity: [0.3, 0.6 + (minerLevel * 0.05), 0.3],
        }}
        transition={{
          duration: 2 - (minerLevel * 0.05),
          repeat: Infinity,
        }}
        className={`absolute rounded-full bg-green-500 blur-[80px]`}
        style={{
          width: 280 + (minerLevel * 10),
          height: 280 + (minerLevel * 10),
        }}
      />

      {/* Floating coins */}
      <AnimatePresence>
        {coins.map(coin => (
          <motion.div
            key={coin.id}
            initial={{ 
              x: coin.x, 
              y: 0, 
              opacity: 1,
              scale: coin.scale 
            }}
            animate={{
              y: -150 - Math.random() * 50,
              x: coin.x + (Math.random() - 0.5) * 50,
              opacity: 0,
              rotate: coin.rotation + 180,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: "easeOut",
            }}
            className="absolute text-4xl pointer-events-none"
            style={{
              left: "50%",
              top: "40%",
            }}
          >
            💎
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ASIC with physics-based animation */}
      <motion.div
        animate={{
          y: [0, -4 - (minerLevel * 0.5), 0],
          rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 2.5 - (minerLevel * 0.1),
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <Image
          src="/images/fan.png"
          alt="ASIC Miner"
          width={380 + (minerLevel * 5)}
          height={380 + (minerLevel * 5)}
          priority
          className="drop-shadow-2xl"
        />

        {/* Mining status */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="absolute -bottom-8 w-full text-center"
        >
          <div className="text-green-400 font-bold text-lg">
            ⚡ MINING LVL {minerLevel}
          </div>
        </motion.div>

        {/* Hash rate display */}
        <motion.div
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
          className="absolute -bottom-14 w-full text-center"
        >
          <div className="text-zinc-400 text-sm">
            {hashRate.toFixed(1)} TH/s
          </div>
        </motion.div>
      </motion.div>

      {/* Power indicator */}
      <div className="absolute -right-4 top-1/2 -translate-y-1/2">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="bg-zinc-900 border border-green-700 rounded-xl px-3 py-2"
        >
          <div className="text-green-400 font-bold text-sm">
            {minerPower.toFixed(2)} FREE/min
          </div>
        </motion.div>
      </div>

      {/* Temperature indicator */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
          className="bg-zinc-900 border border-orange-700 rounded-xl px-3 py-2"
        >
          <div className="text-orange-400 font-bold text-sm">
            {(45 + minerLevel * 3).toFixed(0)}°C
          </div>
        </motion.div>
      </div>
    </div>
  );
}