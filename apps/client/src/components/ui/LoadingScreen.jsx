import React, { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingBar } from './LoadingBar';

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate dynamic progress loading
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 100;
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 90); // Cap at 90% until loaded
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="w-full max-w-md p-8 flex flex-col items-center">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col items-center"
        >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 mb-4">
                <Code2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CodeLab</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Initializing environment...</p>
        </motion.div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden relative">
            <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
            />
            {/* Shimmer Effect */}
            <motion.div
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
        </div>
        
        <div className="mt-4 flex justify-between w-full text-xs text-slate-400 font-mono">
            <span>LOADING MODULES</span>
            <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};
