import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HomeTopNavbar from '../../components/layout/HomeTopNavbar';
import { getPostById } from '../../services/postService';
import { Calendar, User, ChevronLeft, Clock, Tag } from 'lucide-react';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPostById(id)
      .then(data => setPost(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingScreen />;
  
  if (error) return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950">
          <p className="text-xl mb-4">{error}</p>
          <Link to="/blog" className="text-indigo-500 hover:underline">Back to Blog</Link>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-500">
      <HomeTopNavbar />
      
      <article className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-indigo-500 mb-8 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Blog
        </Link>
        
        <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                {post.title}
            </h1>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                    {post.readingTime || 1} min read
                </div>
                {post.user && (
                    <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-indigo-500" />
                        {post.user.username}
                    </div>
                )}
            </div>

            {post.tags && (
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {post.tags.split(',').map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400">
                            #{tag.trim()}
                        </span>
                    ))}
                </div>
            )}
        </header>
        
        {post.featuredImage && (
            <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl">
                <img src={post.featuredImage} alt={post.title} className="w-full object-cover max-h-[500px]" />
            </div>
        )}
        
        <div className="prose prose-lg dark:prose-invert mx-auto max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
