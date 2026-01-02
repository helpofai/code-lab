import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/authStore';
import { FadeIn } from '../../components/ui/FadeIn';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import Modal from '../../components/ui/Modal';
import { 
    Code2, Globe, Trash2, Edit, Plus, 
    ExternalLink, Power, CheckCircle2, AlertCircle, FileCode
} from 'lucide-react';
import { cn } from '../../utils/cn';

const ScriptManagement = () => {
  const { user } = useAuthStore();
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScript, setSelectedUser] = useState(null); // Actually selectedScript

  const [formData, setFormData] = useState({ name: '', url: '', type: 'js', isActive: true });

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch('/api/scripts', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setScripts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
      e.preventDefault();
      const token = useAuthStore.getState().token;
      const method = selectedScript ? 'PUT' : 'POST';
      const url = selectedScript ? `/api/scripts/${selectedScript.id}` : '/api/scripts';
      
      try {
          const res = await fetch(url, {
              method,
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify(formData)
          });
          if (res.ok) {
              fetchScripts();
              setIsModalOpen(false);
              setSelectedUser(null);
              setFormData({ name: '', url: '', type: 'js', isActive: true });
          }
      } catch (err) {
          alert('Failed to save script');
      }
  };

  const handleDelete = async (id) => {
      if (!window.confirm('Delete this script?')) return;
      const token = useAuthStore.getState().token;
      try {
          await fetch(`/api/scripts/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          setScripts(prev => prev.filter(s => s.id !== id));
      } catch (err) {
          alert('Failed to delete');
      }
  };

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout role={user?.role || 'admin'}>
      <FadeIn>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Script Update Feature</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Manage global JS and CSS libraries injected into user Pens.
            </p>
          </div>
          <button 
            onClick={() => { setSelectedUser(null); setFormData({ name: '', url: '', type: 'js', isActive: true }); setIsModalOpen(true); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={18} /> Add Script
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
                <div key={script.id} className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 relative group overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "p-3 rounded-xl",
                            script.type === 'js' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                            {script.type === 'js' ? <FileCode size={20} /> : <Globe size={20} />}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => { setSelectedUser(script); setFormData(script); setIsModalOpen(true); }}
                                className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                            >
                                <Edit size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(script.id)}
                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        {script.name}
                        {script.isActive ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                        ) : (
                            <AlertCircle size={14} className="text-slate-400" />
                        )}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate mb-4 bg-slate-50 dark:bg-white/5 p-2 rounded-md">
                        {script.url}
                    </p>

                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-400">
                        <span>{script.type} Library</span>
                        <span className={script.isActive ? "text-emerald-500" : "text-rose-500"}>
                            {script.isActive ? "Active" : "Disabled"}
                        </span>
                    </div>
                </div>
            ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedScript ? "Edit Script" : "Add New Script"}>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Library Name</label>
                    <input 
                        required
                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Tailwind CSS"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CDN URL</label>
                    <textarea 
                        required
                        rows={3}
                        className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        value={formData.url}
                        onChange={e => setFormData({...formData, url: e.target.value})}
                        placeholder="https://..."
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type</label>
                        <select 
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="js">JavaScript (Script)</option>
                            <option value="css">CSS (Link)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                        <select 
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
                            value={formData.isActive}
                            onChange={e => setFormData({...formData, isActive: e.target.value === 'true'})}
                        >
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                        </select>
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold">
                        {selectedScript ? 'Update' : 'Add'} Script
                    </button>
                </div>
            </form>
        </Modal>
      </FadeIn>
    </DashboardLayout>
  );
};

export default ScriptManagement;
