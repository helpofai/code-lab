import React, { useState, useEffect } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { motion } from "framer-motion";

const codeSnippet = `import React from 'react';

export default function Hero() {
  return (
    <div className="p-8 flex items-center justify-center">
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse">
        Hello Code Lab
      </h1>
    </div>
  );
}
`;

export const CodeDemo = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    
    // Typing loop
    const typeInterval = setInterval(() => {
      if (currentIndex < codeSnippet.length) {
        currentText += codeSnippet[currentIndex];
        setText(currentText);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        // Optional: Reset after delay to loop
        setTimeout(() => {
            setText("");
            currentIndex = 0;
            setIsTyping(true);
        }, 5000);
      }
    }, 30); // Typing speed

    return () => clearInterval(typeInterval);
  }, []);

  // Calculate "progress" of the preview based on code length/content
  // For this demo, we'll reveal the preview once the opening <div> is typed
  const showPreview = text.includes('return (');
  const showText = text.includes('Hello Code Lab');
  const showGradient = text.includes('bg-gradient-to-r');

  return (
    <div className="w-full h-full bg-[#1e1e1e] rounded-2xl flex flex-col overflow-hidden border border-neutral-800">
      {/* Toolbar */}
      <div className="h-10 bg-[#252526] flex items-center px-4 space-x-2 border-b border-black">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="ml-4 px-3 py-1 bg-[#1e1e1e] text-xs text-neutral-400 rounded-t-md flex items-center">
             <span className="mr-2">Hero.jsx</span>
             {isTyping && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
        {/* Editor */}
        <div className="p-4 md:p-6 font-mono text-sm overflow-hidden border-r border-black bg-[#1e1e1e] relative">
           <Highlight
            theme={themes.vsDark}
            code={text}
            language="jsx"
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre style={style} className="bg-transparent mb-4">
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="inline-block w-6 text-neutral-600 select-none text-xs text-right mr-4">{i + 1}</span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
          {/* Blinking Cursor */}
          {isTyping && (
             <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-indigo-500 align-middle ml-1"
             />
          )}
        </div>

        {/* Live Preview */}
        <div className="bg-white/5 flex items-center justify-center p-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
             
             {showPreview && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm"
                 >
                     {showText && (
                         <h1 className={`text-4xl md:text-5xl font-black transition-all duration-500 ${showGradient ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600' : 'text-white'}`}>
                             Hello Code Lab
                         </h1>
                     )}
                     {!showText && (
                         <div className="h-12 w-48 bg-white/10 rounded animate-pulse"></div>
                     )}
                 </motion.div>
             )}
             
             {!showPreview && (
                 <div className="text-neutral-500 text-sm font-mono">
                     Initializing Preview environment...
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
