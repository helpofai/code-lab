import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const LoadingBar = ({ className }) => {
  return (
    <div className={cn("h-1 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{ width: "50%" }}
      />
    </div>
  );
};
