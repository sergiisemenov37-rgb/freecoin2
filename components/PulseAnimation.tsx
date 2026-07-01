"use client";

import { motion } from "framer-motion";

interface PulseAnimationProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function PulseAnimation({ children, className = "", intensity = 1.2 }: PulseAnimationProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, intensity, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}
