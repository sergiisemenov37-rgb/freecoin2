"use client";

import { motion } from "framer-motion";

interface SlideInAnimationProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}

export default function SlideInAnimation({ 
  children, 
  direction = "up", 
  delay = 0,
  className = "" 
}: SlideInAnimationProps) {
  const directions = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: 100, opacity: 0 },
    down: { y: -100, opacity: 0 }
  };

  return (
    <motion.div
      className={className}
      initial={directions[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
