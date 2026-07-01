"use client";

import { motion } from "framer-motion";

interface BounceAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function BounceAnimation({ children, className = "", delay = 0 }: BounceAnimationProps) {
  return (
    <motion.div
      className={className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay
      }}
    >
      {children}
    </motion.div>
  );
}
