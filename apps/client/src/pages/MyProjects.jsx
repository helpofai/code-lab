import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import useAuthStore from '../store/authStore';
import { FadeIn } from '../components/ui/FadeIn';
import { Layout, PenTool, Search, Calendar, MoreVertical, Trash2, Edit, Code2, Eye, Lock, Unlock, Heart } from 'lucide-react';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { cn } from '../utils/cn';
import Sass from 'sass.js/dist/sass.sync.js';

const MyProjects = () => {
// ... existing code ...
  const { user, token } = useAuthStore();
  const [projects, setProjects] = useState([]);
// ... (rest of the file content)
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/pens/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this project?')) return;
      
      try {
          const res = await fetch(`/api/pens/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          if (res.ok) {
              setProjects(prev => prev.filter(p => p.id !== id));
          } else {
              const data = await res.json();
              alert(data.message || 'Failed to delete project');
          }
      } catch (err) {
          console.error(err);
          alert('An error occurred');
      }
  }

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingScreen />;

  const role = user?.role || 'user';

  return (
    <DashboardLayout role={role}>
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Projects</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Manage and organize your code creations.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
            </div>
            <Link to={`/dashboard/${role}/editor`}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                    <PenTool className="h-4 w-4" />
                    <span className="hidden sm:inline">New Project</span>
                </button>
            </Link>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 border-dashed">
                <div className="h-16 w-16 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                    <Layout className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No projects found</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
                    {searchTerm ? "No projects match your search query." : "You haven't created any projects yet. Start coding to bring your ideas to life!"}
                </p>
                <Link to={`/dashboard/${role}/editor`}>
                    <button className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                        Create your first project &rarr;
                    </button>
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} role={role} onDelete={() => handleDelete(project.id)} />
                ))}
            </div>
        )}
      </FadeIn>
    </DashboardLayout>
  );
};

const ProjectCard = ({ project, role, onDelete }) => {
    const [compiledCss, setCompiledCss] = useState(project.css);
    const iframeRef = useRef(null);
    const [isPrivate, setIsPrivate] = useState(false); // Placeholder state

    useEffect(() => {
        // Compile SCSS for thumbnail
        Sass.compile(project.css, (result) => {
            if (result.status === 0) {
                setCompiledCss(result.text);
            } else {
                setCompiledCss(project.css); // Fallback
            }
        });
    }, [project.css]);

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
                ${project.html}
                <script>
                    try {
                        ${project.js}
                    } catch (e) {
                        console.error("Thumbnail JS Error:", e);
                    }
                </script>
              </body>
            </html>
        `;
        
        iframeRef.current.srcdoc = srcDoc;
    }, [project.html, compiledCss, project.js]);

    return (
        <div className="group relative bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Live Preview Thumbnail */}
            <div className="h-40 bg-slate-100 dark:bg-neutral-900 relative overflow-hidden">
                <iframe
                    ref={iframeRef}
                    title={project.title}
                    sandbox="allow-scripts allow-modals"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    className="pointer-events-none select-none overflow-hidden w-[200%] h-[200%] origin-top-left scale-50"
                    scrolling="no"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-3">
                    <Link to={`/dashboard/${role}/editor/${project.id}`}>
                        <button className="p-2 bg-white dark:bg-black rounded-full text-slate-700 dark:text-slate-200 hover:text-indigo-500 hover:scale-110 transition-all shadow-lg tooltip" title="Edit">
                            <Edit className="h-5 w-5" />
                        </button>
                    </Link>
                    <Link to={`/dashboard/${role}/editor/${project.id}`}>
                        <button className="p-2 bg-white dark:bg-black rounded-full text-slate-700 dark:text-slate-200 hover:text-green-500 hover:scale-110 transition-all shadow-lg tooltip" title="Preview">
                            <Eye className="h-5 w-5" />
                        </button>
                    </Link>
                    <button 
                        onClick={(e) => { e.preventDefault(); setIsPrivate(!isPrivate); }}
                        className="p-2 bg-white dark:bg-black rounded-full text-slate-700 dark:text-slate-200 hover:text-yellow-500 hover:scale-110 transition-all shadow-lg tooltip" 
                        title={isPrivate ? "Make Public" : "Make Private"}
                    >
                        {isPrivate ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    </button>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete();
                        }}
                        className="p-2 bg-white dark:bg-black rounded-full text-slate-700 dark:text-slate-200 hover:text-red-500 hover:scale-110 transition-all shadow-lg tooltip"
                        title="Delete"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <Link to={`/dashboard/${role}/editor/${project.id}`}>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                            {project.title || "Untitled Project"}
                        </h3>
                    </Link>
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 h-10">
                    A web project created with HTML, CSS, and JavaScript.
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-white/5 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1" title="Views">
                            <Eye className="h-3 w-3" />
                            <span>{project.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Likes">
                            <Heart className="h-3 w-3" />
                            <span>{project.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 dark:text-slate-300 flex items-center gap-1", isPrivate ? "text-yellow-600" : "text-green-600")}>
                            {isPrivate ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            {isPrivate ? "Private" : "Public"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProjects;
