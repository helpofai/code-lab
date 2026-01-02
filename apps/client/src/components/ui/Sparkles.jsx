import React, { useId, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "../../utils/cn";

export const SparklesCore = (props) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const [init, setInit] = useState(false);
  
  // This is a simplified version using CSS animations for particles instead of ts-particles to avoid extra deps if possible,
  // but for "Pro" feel, I'll simulate it with simple DOM nodes or just SVG.
  // Actually, to keep it reliable without complex canvas logic here:
  
  return (
    <div className={cn("absolute inset-0 block", className)}>
        {/* Simplified Sparkles Implementation */}
       <div className="w-full h-full relative overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                initial={{
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                    opacity: 0,
                    scale: 0
                }}
                animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                }}
                transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2
                }}
                style={{
                    width: Math.random() * 2 + 1 + "px",
                    height: Math.random() * 2 + 1 + "px",
                }}
            />
          ))}
       </div>
    </div>
  );
};
