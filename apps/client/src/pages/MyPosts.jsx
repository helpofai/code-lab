import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import useAuthStore from '../store/authStore';
import { FadeIn } from '../components/ui/FadeIn';
import { Search, PenTool, Layout, Edit, Trash2, Calendar, Eye, FileText } from 'lucide-react';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { getUserPosts, deletePost } from '../services/postService';
import { cn } from '../utils/cn';

const MyPosts = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getUserPosts()
      .then(data => setPosts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this post?')) return;
      try {
          await deletePost(id);
          setPosts(prev => prev.filter(p => p.id !== id));
      } catch (err) {
          alert('Failed to delete post');
      }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingScreen />;

  const role = user?.role || 'user';

  return (
    <DashboardLayout role={role}>
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Posts</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Manage your blog posts and articles.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search posts..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
            </div>
            <Link to={`/dashboard/posts/new`}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                    <PenTool className="h-4 w-4" />
                    <span className="hidden sm:inline">New Post</span>
                </button>
            </Link>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed">
                <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
                    {searchTerm ? "No posts match your search query." : "You haven't wrote any posts yet."}
                </p>
                <Link to={`/dashboard/posts/new`}>
                    <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        Write your first post &rarr;
                    </button>
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {filteredPosts.map((post) => (
                    <PostRow key={post.id} post={post} onDelete={() => handleDelete(post.id)} />
                ))}
            </div>
        )}
      </FadeIn>
    </DashboardLayout>
  );
};

const PostRow = ({ post, onDelete }) => {
    return (
        <div className="group flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-4 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200">
            <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {post.title || "Untitled Post"}
                    </h3>
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full border",
                        post.status === 'published' 
                            ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                    )}>
                        {post.status}
                    </span>
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-4">
                     <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.updatedAt).toLocaleDateString()}
                     </span>
                     <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views} views
                     </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Link to={`/dashboard/posts/edit/${post.id}`}>
                    <button className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                    </button>
                </Link>
                <button 
                    onClick={onDelete}
                    className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

export default MyPosts;
