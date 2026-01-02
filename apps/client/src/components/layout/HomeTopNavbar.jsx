import { Link } from 'react-router-dom';
import { Code2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../ui/ThemeToggle';

const HomeTopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">CodeLab</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6">
              <Link to="/editor" className="text-sm font-medium text-neutral-600 dark:text-gray-300 transition-colors hover:text-black dark:hover:text-white">
                Editor
              </Link>
              <Link to="/blog" className="text-sm font-medium text-neutral-600 dark:text-gray-300 transition-colors hover:text-black dark:hover:text-white">
                Blog
              </Link>
              <a href="/#features" className="text-sm font-medium text-neutral-600 dark:text-gray-300 transition-colors hover:text-black dark:hover:text-white">
                Features
              </a>
              <a href="/#pricing" className="text-sm font-medium text-neutral-600 dark:text-gray-300 transition-colors hover:text-black dark:hover:text-white">
                Pricing
              </a>
              
              <div className="h-6 w-px bg-neutral-200 dark:bg-white/10 mx-2"></div>

              <div className="flex items-center space-x-4">
                <ThemeToggle />
                
                {user ? (
                  <>
                    <Link to="/dashboard" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-full bg-neutral-100 dark:bg-white/10 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/20">
                        {user.role === 'admin' ? 'Admin Dashboard' : 
                         user.role === 'paid-user' ? 'Pro Dashboard' : 
                         user.role === 'member' ? 'Member Area' : 'Dashboard'}
                    </Link>
                    <button 
                      onClick={logout}
                      className="rounded-full bg-transparent hover:bg-neutral-100 dark:hover:bg-white/10 px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                        to="/login" 
                        state={{ mode: 'login' }}
                        className="text-sm font-medium text-neutral-600 dark:text-gray-300 transition-colors hover:text-black dark:hover:text-white"
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/login" 
                      state={{ mode: 'register' }}
                      className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-black"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-white/5 bg-white/90 dark:bg-black/90 backdrop-blur-xl">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link to="/editor" className="block rounded-md px-3 py-2 text-base font-medium text-neutral-600 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white">
              Editor
            </Link>
            <Link to="/blog" className="block rounded-md px-3 py-2 text-base font-medium text-neutral-600 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white">
              Blog
            </Link>
            <a href="/#features" className="block rounded-md px-3 py-2 text-base font-medium text-neutral-600 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white">
              Features
            </a>
            <a href="/#pricing" className="block rounded-md px-3 py-2 text-base font-medium text-neutral-600 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white">
              Pricing
            </a>
            <div className="mt-4 border-t border-neutral-200 dark:border-white/10 pt-4 px-3">
               {user ? (
                 <button onClick={logout} className="w-full text-left font-medium text-neutral-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Logout</button>
               ) : (
                 <div className="flex flex-col space-y-3">
                    <Link to="/login" state={{ mode: 'login' }} className="text-neutral-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Log In</Link>
                    <Link to="/login" state={{ mode: 'register' }} className="rounded-full bg-indigo-600 px-4 py-2 text-center font-semibold text-white">Sign Up</Link>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeTopNavbar;
