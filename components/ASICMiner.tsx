"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ASICMiner() {
  return (
    <div className="relative flex justify-center items-center py-8">

      {/* Зеленое свечение */}

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute w-80 h-80 rounded-full bg-green-500 blur-[80px]"
      />

      {/* ASIC */}

      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="relative"
      >
        <Image
          src="/images/fan.png"
          alt="ASIC Miner"
          width={420}
          height={420}
          priority
        />

        {/* Mining */}

        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}
          className="absolute -bottom-6 w-full text-center text-green-400 font-bold text-2xl"
        >
          ● MINING...
        </motion.div>

      </motion.div>

    </div>
  );
}