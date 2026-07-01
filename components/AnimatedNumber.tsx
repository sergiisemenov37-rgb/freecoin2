"use client";

import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

export default function AnimatedNumber({ value, duration = 1, format }: AnimatedNumberProps) {
  const animated = useSpring(useMotionValue(0), {
    stiffness: 60,
    damping: 15,
    duration
  });

  useEffect(() => {
    animated.set(value);
  }, [value, animated]);

  const display = format 
    ? useTransform(animated, format)
    : useTransform(animated, (v) => Math.round(v).toLocaleString());

  return <motion.span>{display}</motion.span>;
}
