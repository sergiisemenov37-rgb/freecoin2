"use client";

import { motion } from "framer-motion";

interface ShimmerEffectProps {
  children: React.ReactNode;
  className?: string;
}

export default function ShimmerEffect({ children, className = "" }: ShimmerEffectProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        variants={{
          hover: {
            x: ["-100%", "100%"],
            transition: {
              x: {
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }
            }
          }
        }}
      />
      {children}
    </motion.div>
  );
}
