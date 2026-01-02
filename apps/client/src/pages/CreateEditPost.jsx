import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import useAuthStore from '../store/authStore';
import { FadeIn } from '../components/ui/FadeIn';
import { createPost, getPostById, updatePost } from '../services/postService';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import TiptapEditor from '../components/ui/TiptapEditor';

const CreateEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
      title: '',
      content: '',
      excerpt: '',
      featuredImage: '',
      status: 'draft',
      tags: ''
  });

  useEffect(() => {
    if (id) {
        getPostById(id)
            .then(data => {
                setFormData({
                    title: data.title,
                    content: data.content,
                    excerpt: data.excerpt || '',
                    featuredImage: data.featuredImage || '',
                    status: data.status,
                    tags: data.tags || ''
                });
            })
            .catch(err => {
                console.error(err);
                alert('Failed to load post');
                navigate('/dashboard/posts');
            })
            .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
          if (id) {
              await updatePost(id, formData);
          } else {
              await createPost(formData);
          }
          navigate('/dashboard/posts');
      } catch (err) {
          console.error(err);
          alert('Failed to save post');
      } finally {
          setSaving(false);
      }
  };

  if (loading) return (
      <DashboardLayout role={user?.role || 'user'}>
          <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
      </DashboardLayout>
  );

  return (
    <DashboardLayout role={user?.role || 'user'}>
      <FadeIn>
        <div className="flex items-center gap-4 mb-8">
            <button 
                onClick={() => navigate('/dashboard/posts')}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                <ArrowLeft className="h-5 w-5 text-slate-500" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {id ? 'Edit Post' : 'Create New Post'}
            </h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-6 space-y-6">
                
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter post title"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Content
                    </label>
                    <TiptapEditor 
                        content={formData.content} 
                        onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} 
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Excerpt (Optional)
                    </label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="Brief summary..."
                    />
                </div>

                {/* Featured Image */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Featured Image URL (Optional)
                    </label>
                    <input
                        type="text"
                        name="featuredImage"
                        value={formData.featuredImage}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Tags (Comma separated)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="react, tutorial, webdev"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Post
                </button>
            </div>
        </form>
      </FadeIn>
    </DashboardLayout>
  );
};

export default CreateEditPost;
