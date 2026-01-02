import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomeTopNavbar from '../../components/layout/HomeTopNavbar';
import { BackgroundBeams } from '../../components/ui/BackgroundBeams';
import { FadeIn } from '../../components/ui/FadeIn';
import { getAllPosts } from '../../services/postService';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { cn } from '../../utils/cn';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPosts()
      .then(data => setPosts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <HomeTopNavbar />
      
      {/* Hero */}
      <div className="relative w-full pt-32 pb-20 overflow-hidden">
        <BackgroundBeams className="opacity-20 dark:opacity-40" />
        
        <FadeIn className="z-10 relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
               <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                 Code Lab Blog
               </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Insights, tutorials, and updates from the Code Lab community.
            </p>
        </FadeIn>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 relative z-10">
        {loading ? (
             <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
             </div>
        ) : error ? (
            <div className="text-center text-red-500 py-20">{error}</div>
        ) : posts.length === 0 ? (
            <div className="text-center text-slate-500 py-20">No posts found.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, i) => (
                    <FadeIn key={post.id} delay={i * 0.1}>
                        <BlogCard post={post} />
                    </FadeIn>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

const BlogCard = ({ post }) => {
    return (
        <Link to={`/blog/${post.id}`} className="group block h-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            {post.featuredImage && (
                <div className="h-48 overflow-hidden">
                    <img 
                        src={post.featuredImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-4 space-x-4">
                    <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-indigo-500" />
                        {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-indigo-500" />
                        {post.readingTime || 1} min read
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
                    {post.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                </p>

                {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.split(',').map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>
                )}
                
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium group-hover:underline">
                    Read Article <ArrowRight className="h-4 w-4 ml-1" />
                </div>
            </div>
        </Link>
    )
}

export default BlogList;
