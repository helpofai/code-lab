import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Label } from '../components/ui/Label';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';
import { Code2, Github, ArrowRight } from 'lucide-react';
import { BackgroundBeams } from '../components/ui/BackgroundBeams';

const Login = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setToken = useAuthStore(state => state.setToken);
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    if (location.state?.mode) {
        setIsLogin(location.state.mode !== 'register');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { username, email, password };
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-neutral-950 flex items-center justify-center relative overflow-hidden transition-colors duration-500">
      <BackgroundBeams className="opacity-20" />
      
      <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black z-10 border border-slate-200 dark:border-white/10">
        <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white group-hover:scale-110 transition-transform">
                <Code2 className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-neutral-800 dark:text-neutral-100">CodeLab</span>
            </Link>
        </div>

        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center mx-auto">
          {isLogin ? "Login to access your saved pens and projects." : "Join thousands of developers building the future."}
        </p>

        {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm text-center">
                {error}
            </div>
        )}

        <form className="my-8" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
               <LabelInputContainer>
                <Label htmlFor="username">Username</Label>
                <Input 
                    id="username" 
                    placeholder="codewizard" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
              </LabelInputContainer>
            </div>
          )}

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input 
                id="email" 
                placeholder="projectmayhem@fc.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password" 
                placeholder="••••••••" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : (
                <span className="flex items-center justify-center group">
                    {isLogin ? "Log In" : "Sign Up"} 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
            )}
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="text-center text-sm">
             <span className="text-neutral-600 dark:text-neutral-400">
                 {isLogin ? "Don't have an account?" : "Already have an account?"}
             </span>
             <button
                type="button"
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                }}
                className="ml-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
             >
                 {isLogin ? "Sign Up" : "Log In"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default Login;