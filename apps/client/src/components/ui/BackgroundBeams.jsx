import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const BackgroundBeams = ({ className }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full bg-neutral-950 overflow-hidden",
        className
      )}
    >
        <div className="absolute inset-0 bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-[100px] transform -translate-y-1/2"></div>
      
      {/* Animated Beams */}
      <motion.div
         initial={{ opacity: 0.5, rotate: 0 }}
         animate={{ opacity: [0.4, 0.6, 0.4], rotate: 360 }}
         transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
         className="absolute top-[50%] left-[50%] w-[150vw] h-[150vw] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#4f46e5_50%)] opacity-20 blur-3xl"
      />
      <motion.div
         initial={{ opacity: 0.5, rotate: 0 }}
         animate={{ opacity: [0.3, 0.5, 0.3], rotate: -360 }}
         transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
         className="absolute top-[50%] left-[50%] w-[120vw] h-[120vw] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,#00000000_50%,#9333ea_50%)] opacity-20 blur-3xl"
      />
    </div>
  );
};
