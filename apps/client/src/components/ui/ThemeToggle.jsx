import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/themeStore';

const ThemeToggle = () => {
  const { theme, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
      initTheme();
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:focus:ring-white/20"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'dark' ? 1 : 0,
          opacity: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : 90,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-white" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === 'light' ? 1 : 0,
          opacity: theme === 'light' ? 1 : 0,
          rotate: theme === 'light' ? 0 : -90,
        }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-neutral-800" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
