import { Link } from 'react-router-dom';
import { Zap, Terminal, Globe, Shield, Users, Layout, CheckCircle2, Heart, Eye, Cloud, Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import HomeTopNavbar from '../components/layout/HomeTopNavbar';
import { BackgroundBeams } from '../components/ui/BackgroundBeams';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { Button } from '../components/ui/MovingBorderBtn';
import { ContainerScroll } from '../components/ui/ContainerScroll';
import { TextGenerateEffect } from '../components/ui/TextGenerateEffect';
import { InfiniteMovingCards } from '../components/ui/InfiniteMovingCards';
import { TracingBeam } from '../components/ui/TracingBeam';
import { CodeDemo } from '../components/ui/CodeDemo';
import { FadeIn } from '../components/ui/FadeIn';
import { cn } from '../utils/cn';
import Sass from 'sass.js/dist/sass.sync.js';

const Home = () => {
  const [recentPens, setRecentPens] = useState([]);
  const [trendingPens, setTrendingPens] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Fetch Recent Pens
    fetch('/api/pens/public/recent')
      .then(res => res.json())
      .then(data => setRecentPens(data))
      .catch(err => console.error(err));

    // Fetch Trending/Most Viewed Pens
    fetch('/api/pens/public/trending')
      .then(res => res.json())
      .then(data => setTrendingPens(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        setIsSearching(true);
        fetch(`/api/pens/search?q=${encodeURIComponent(searchQuery)}`)
          .then(res => res.json())
          .then(data => setSearchResults(data))
          .catch(err => console.error(err));
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const clearSearch = () => {
      setSearchQuery('');
      setIsSearching(false);
      setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30 overflow-hidden w-full transition-colors duration-500">
      <HomeTopNavbar />
      
      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        <BackgroundBeams className="opacity-20 dark:opacity-40" />
        
        <FadeIn className="z-10 relative w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
                v2.0 is now live
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8">
               <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                 Code Lab
               </span>
            </h1>
            
            <TextGenerateEffect
              words="The ultimate development workspace for the modern web."
              className="text-center text-xl md:text-3xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 font-normal leading-relaxed"
            />
            
            <div className="w-full max-w-md relative mb-8 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-10 py-4 border border-slate-200 dark:border-slate-800 rounded-full leading-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-lg"
                    placeholder="Search for projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button 
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                 <Link to="/editor">
                    <Button
                        borderRadius="1.75rem"
                        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 font-bold text-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-shadow duration-300"
                    >
                        Start Coding
                    </Button>
                 </Link>
            </div>
        </FadeIn>
      </div>

      {/* Search Results Section */}
      {isSearching && (
          <section className="py-20 relative z-20 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 min-h-[50vh]">
             <div className="max-w-7xl mx-auto px-4">
                 <FadeIn className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                         Search Results
                     </h2>
                     <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                         Found {searchResults.length} projects matching "{searchQuery}"
                     </p>
                 </FadeIn>
                 
                 {searchResults.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {searchResults.map((pen, i) => (
                             <FadeIn key={pen.id} delay={i * 0.05}>
                                 <HomeProjectCard pen={pen} />
                             </FadeIn>
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-20">
                         <p className="text-slate-500 dark:text-slate-400">No projects found. Try a different search term.</p>
                     </div>
                 )}
             </div>
          </section>
      )}

      {/* 3D Scroll Preview */}
      {!isSearching && (
        <div className="flex flex-col overflow-hidden -mt-32 md:-mt-48 z-20 relative">
            <ContainerScroll
                titleComponent={
                <FadeIn>
                    <h1 className="text-4xl font-semibold text-slate-900 dark:text-white mb-8">
                    Write code at the speed of thought <br />
                    <span className="text-4xl md:text-[6rem] font-bold mt-2 leading-none text-indigo-600 dark:text-indigo-400">
                        Live Preview Included
                    </span>
                    </h1>
                </FadeIn>
                }
            >
                <CodeDemo />
            </ContainerScroll>
        </div>
      )}

      {/* Trending Projects Section */}
      {!isSearching && (
      <section className="py-20 relative z-10 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-4">
             <FadeIn className="text-center mb-12">
                 <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                     Trending Community Projects
                 </h2>
                 <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                     Explore the most viewed projects created by Code Lab developers.
                 </p>
             </FadeIn>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {trendingPens.map((pen, i) => (
                     <FadeIn key={pen.id} delay={i * 0.1}>
                         <HomeProjectCard pen={pen} />
                     </FadeIn>
                 ))}
             </div>
         </div>
      </section>
      )}

      {/* Recent Projects Section */}
      {!isSearching && (
      <section className="py-20 relative z-10 bg-slate-50 dark:bg-slate-950">
         <div className="max-w-7xl mx-auto px-4">
             <FadeIn className="text-center mb-12">
                 <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                     Just Shipped
                 </h2>
                 <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                     Check out the latest creations from our community.
                 </p>
             </FadeIn>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {recentPens.map((pen, i) => (
                     <FadeIn key={pen.id} delay={i * 0.1}>
                         <HomeProjectCard pen={pen} />
                     </FadeIn>
                 ))}
             </div>
             
             <div className="mt-12 text-center">
                 <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                     Join to create your own &rarr;
                 </Link>
             </div>
         </div>
      </section>
      )}

      {/* Bento Grid Features */}
      {/* ... (Rest of the sections: Features, Timeline, Testimonials, Pricing, Footer) ... */}
      <section className="max-w-7xl mx-auto py-20 px-4 relative z-10">
         <FadeIn className="text-center mb-20">
             <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                 Everything you need to ship
             </h2>
             <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                 Powerful features designed to help you build faster, safer, and better.
             </p>
         </FadeIn>
         <FadeIn delay={0.2}>
            <BentoGrid className="max-w-4xl mx-auto">
                {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={item.description}
                    header={item.header}
                    icon={item.icon}
                    className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                />
                ))}
            </BentoGrid>
         </FadeIn>
      </section>

      {/* How it Works / Timeline */}
      <section className="py-20 relative z-10 bg-white/50 dark:bg-slate-900/30 backdrop-blur-3xl border-y border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl mx-auto px-4">
             <FadeIn>
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-20 text-slate-900 dark:text-white">How it Works</h2>
             </FadeIn>
             <TracingBeam className="px-6">
                <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                    {timelineContent.map((item, index) => (
                        <FadeIn key={`content-${index}`} delay={index * 0.1} className="mb-24 last:mb-0">
                            <div className="flex items-center mb-4">
                                <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full text-xs font-bold px-3 py-1 border border-slate-200 dark:border-slate-700 shadow-sm mr-4">
                                    {item.badge}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {item.title}
                                </h3>
                            </div>
                            <div className="text-base leading-relaxed text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                                {item.description}
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </TracingBeam>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 relative z-10 overflow-hidden bg-slate-50 dark:bg-slate-950">
          <FadeIn className="max-w-7xl mx-auto px-4 mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 dark:text-white">Loved by Developers</h2>
          </FadeIn>
          <div className="h-[22rem] rounded-md flex flex-col antialiased bg-white dark:bg-slate-950 dark:bg-grid-white/[0.05] bg-grid-slate-900/[0.05] items-center justify-center relative overflow-hidden mask-linear-gradient">
              <InfiniteMovingCards
                  items={testimonials}
                  direction="right"
                  speed="slow"
              />
          </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 relative z-10">
         <div className="max-w-7xl mx-auto px-4">
             <FadeIn className="text-center mb-20">
                 <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Simple Pricing</h2>
                 <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                     Choose the plan that fits your needs. No hidden fees, cancel anytime.
                 </p>
             </FadeIn>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                 {pricingPlans.map((plan, i) => (
                     <FadeIn key={i} delay={i * 0.1}>
                         <div className={cn(
                             "h-full rounded-3xl p-8 border flex flex-col relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
                             plan.featured 
                                ? "border-indigo-500 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 z-10 scale-105" 
                                : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900"
                         )}>
                             {plan.featured && (
                                 <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                             )}
                             <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{plan.name}</h3>
                             <div className="my-6 flex items-baseline">
                                 <span className="text-5xl font-extrabold text-slate-900 dark:text-white">${plan.price}</span>
                                 <span className="text-slate-500 ml-2">/mo</span>
                             </div>
                             <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{plan.description}</p>
                             <ul className="space-y-4 mb-8 flex-1">
                                 {plan.features.map((feature, idx) => (
                                     <li key={idx} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                                         <CheckCircle2 className={cn("h-5 w-5 mr-3 flex-shrink-0", plan.featured ? "text-indigo-500" : "text-slate-400")} />
                                         {feature}
                                     </li>
                                 ))}
                             </ul>
                             <Link to="/login" className={cn(
                                 "w-full py-4 rounded-xl font-bold text-center transition-all duration-200 shadow-sm",
                                 plan.featured 
                                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 shadow-lg" 
                                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-900 dark:text-white"
                             )}>
                                 {plan.cta}
                             </Link>
                         </div>
                     </FadeIn>
                 ))}
             </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Terminal className="h-5 w-5" />
             </div>
             <span className="text-xl font-bold text-slate-900 dark:text-white">CodeLab</span>
          </div>
          <div className="flex space-x-8 text-sm font-medium text-slate-600 dark:text-slate-400">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">GitHub</a>
          </div>
          <p className="text-slate-500 text-sm mt-4 md:mt-0">
            © 2025 CodeLab Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

const HomeProjectCard = ({ pen }) => {
    const [compiledCss, setCompiledCss] = useState(pen.css);
    const iframeRef = useRef(null);

    useEffect(() => {
        // Compile SCSS for thumbnail
        Sass.compile(pen.css, (result) => {
            if (result.status === 0) {
                setCompiledCss(result.text);
            } else {
                setCompiledCss(pen.css); // Fallback
            }
        });
    }, [pen.css]);

    useEffect(() => {
        if (!iframeRef.current) return;

        const srcDoc = `
            <!DOCTYPE html>
            <html>
              <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
                <style>
                    body { margin: 0; padding: 0; overflow: hidden; zoom: 0.5; }
                    ::-webkit-scrollbar { display: none; }
                    ${compiledCss}
                </style>
              </head>
              <body>
                ${pen.html}
                <script>
                    try {
                        ${pen.js}
                    } catch (e) {}
                </script>
              </body>
            </html>
        `;
        
        iframeRef.current.srcdoc = srcDoc;
    }, [pen.html, compiledCss, pen.js]);

    return (
        <Link to={`/pen/${pen.id}`} className="group relative block bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="h-40 bg-slate-100 dark:bg-neutral-900 relative overflow-hidden">
                <iframe
                    ref={iframeRef}
                    title={pen.title}
                    sandbox="allow-scripts allow-modals"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    className="pointer-events-none select-none overflow-hidden w-[200%] h-[200%] origin-top-left scale-50"
                    scrolling="no"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 mb-1">{pen.title || "Untitled"}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">by {pen.user?.username || 'Anonymous'}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{pen.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{pen.likes || 0}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Data & Helpers ---

const SkeletonOne = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden group">
      <div className="absolute inset-0 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]"></div>
      {/* Live Preview Simulation */}
      <div className="absolute inset-4 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="h-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-2 gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 p-2 flex items-center justify-center">
              <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/20"
              />
          </div>
      </div>
  </div>
);

const SkeletonTwo = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-white/[0.02]"></div>
      {/* Monaco IDE Simulation */}
      <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl relative z-10 w-4/5 transform transition-transform group-hover:-rotate-2">
          <div className="flex space-x-1.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-400/80"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400/80"></div>
              <div className="w-2 h-2 rounded-full bg-green-400/80"></div>
          </div>
          <div className="space-y-2">
             <motion.div animate={{ width: ["40%", "70%", "40%"] }} transition={{ duration: 3, repeat: Infinity }} className="h-2 bg-indigo-500/20 rounded"></motion.div>
             <motion.div animate={{ width: ["60%", "30%", "60%"] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="h-2 bg-slate-200 dark:bg-slate-800 rounded"></motion.div>
             <motion.div animate={{ width: ["50%", "80%", "50%"] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} className="h-2 bg-slate-200 dark:bg-slate-800 rounded"></motion.div>
          </div>
      </div>
  </div>
);

const SkeletonThree = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent"></div>
      {/* Cloud Sync Simulation */}
      <div className="relative">
          <Globe className="h-12 w-12 text-indigo-500/20" />
          <motion.div 
            animate={{ 
                y: [-20, 20, -20],
                opacity: [0, 1, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2"
          >
              <Cloud className="h-6 w-6 text-indigo-500" />
          </motion.div>
      </div>
      <div className="absolute bottom-0 w-full h-1/2 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]"></div>
  </div>
);

const SkeletonFour = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700/50 relative overflow-hidden p-4">
        {/* Collaboration Simulation */}
        <div className="flex -space-x-3 items-center justify-center h-full">
            {[1, 2, 3, 4].map((i) => (
                <motion.div 
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                    className={cn(
                        "w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-white",
                        i === 1 ? "bg-indigo-500" : i === 2 ? "bg-emerald-500" : i === 3 ? "bg-pink-500" : "bg-orange-500"
                    )}
                >
                    {String.fromCharCode(64 + i)}
                </motion.div>
            ))}
            <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full border-2 border-dashed border-slate-400 ml-4 flex items-center justify-center text-slate-400"
            >
                +
            </motion.div>
        </div>
    </div>
)

const items = [
  {
    title: "Instant Live Preview",
    description: "Experience zero-latency rendering as you type with our optimized engine.",
    header: <SkeletonOne />,
    icon: <Zap className="h-5 w-5 text-indigo-500" />,
  },
  {
    title: "Monaco Editor",
    description: "The full power of VS Code. IntelliSense, themes, and shortcuts.",
    header: <SkeletonTwo />,
    icon: <Terminal className="h-5 w-5 text-indigo-500" />,
  },
  {
    title: "Cloud Sync",
    description: "Your work is saved automatically. Access from any device.",
    header: <SkeletonThree />,
    icon: <Globe className="h-5 w-5 text-indigo-500" />,
  },
  {
    title: "Secure Sandboxing",
    description: "Enterprise-grade isolation keeps your code and users safe.",
    header: <SkeletonOne />,
    icon: <Shield className="h-5 w-5 text-indigo-500" />,
  },
  {
    title: "Real-time Collaboration",
    description: "Code together with your team in real-time with multiplayer mode.",
    header: <SkeletonFour />,
    icon: <Users className="h-5 w-5 text-indigo-500" />,
  },
];

const testimonials = [
  {
    quote: "Code Lab completely changed how I prototype. The speed is unmatched.",
    name: "Sarah Chen",
    title: "Senior Frontend Dev at Vercel",
  },
  {
    quote: "The Monaco integration is flawless. It feels exactly like my local VS Code.",
    name: "Alex Rivera",
    title: "Full Stack Engineer",
  },
  {
    quote: "Finally, a cloud editor that doesn't lag. The instant preview is a game changer.",
    name: "Marcus Johnson",
    title: "Tech Lead at Stripe",
  },
  {
    quote: "I use Code Lab for all my interviews. It's stable, beautiful, and just works.",
    name: "Emily Zhang",
    title: "Engineering Manager",
  },
  {
    quote: "The collaboration features helped our remote team sync up perfectly.",
    name: "David Kim",
    title: "Product Designer",
  },
];

const timelineContent = [
    {
        badge: "Start",
        title: "Create a Pen",
        description: "Launch a new project with a single click. Choose from pre-configured templates for React, Vue, or vanilla JS, or start from a blank canvas."
    },
    {
        badge: "Code",
        title: "Write & Preview",
        description: "Type in the editor and watch your changes appear instantly. No reload needed. Use the console to debug and inspect elements in real-time."
    },
    {
        badge: "Ship",
        title: "Save & Share",
        description: "Your work is automatically saved. Generate a shareable link, embed it in your documentation, or deploy it to production with one click."
    }
];

const pricingPlans = [
    {
        name: "Starter",
        price: "0",
        description: "Perfect for hobbyists and students starting out.",
        features: ["Unlimited public pens", "Basic editor features", "Community support", "1GB Asset Storage"],
        cta: "Start Free",
        featured: false,
    },
    {
        name: "Pro",
        price: "15",
        description: "For professional developers who need more power.",
        features: ["Unlimited private pens", "10GB Asset hosting", "Collab mode", "Priority support", "Custom Domains"],
        cta: "Get Pro",
        featured: true,
    },
    {
        name: "Team",
        price: "49",
        description: "For engineering teams building together.",
        features: ["Unlimited Team Members", "SSO integration", "Audit logs", "Dedicated success manager", "Private NPM Registry"],
        cta: "Contact Sales",
        featured: false,
    }
];

export default Home;