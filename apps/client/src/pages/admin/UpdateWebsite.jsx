import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/authStore';
import { FadeIn } from '../../components/ui/FadeIn';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { 
    RefreshCw, Download, CheckCircle2, AlertCircle, 
    ChevronRight, FileCode, History, ArrowDownCircle,
    Info, HardDriveDownload
} from 'lucide-react';
import { cn } from '../../utils/cn';

const UpdateWebsite = () => {
  const { user } = useAuthStore();
  const [updateInfo, setUpdateInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, checking, available, up-to-date, downloading, extracted, applying, success
  const [dbSyncing, setDbSyncing] = useState(false);
  const [updateData, setUpdateData] = useState(null);

  const handleDbSync = async () => {
      setDbSyncing(true);
      try {
          const token = useAuthStore.getState().token;
          const res = await fetch('/api/updates/sync-db', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              alert('Database synchronized successfully!');
          }
      } catch (err) {
          alert('Failed to sync database');
      } finally {
          setDbSyncing(false);
      }
  };

  const checkUpdates = async () => {
    setChecking(true);
    setStatus('checking');
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch('/api/updates/check', {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUpdateInfo(data);
      setStatus(data.isUpdateAvailable ? 'available' : 'up-to-date');
    } catch (err) {
      alert('Failed to check for updates');
      setStatus('idle');
    } finally {
      setChecking(false);
    }
  };

  const handleUpdate = async () => {
      setUpdating(true);
      setStatus('downloading');
      
      // Simulate progress bar since we don't have a stream-progress API yet
      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 90) {
                  clearInterval(interval);
                  return 90;
              }
              return prev + 5;
          });
      }, 200);

      try {
          const token = useAuthStore.getState().token;
          const res = await fetch('/api/updates/download', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ commitSha: updateInfo.latest.commit })
          });
          
          if (res.ok) {
              const data = await res.json();
              setUpdateData(data);
              setProgress(100);
              setStatus('extracted');
          }
      } catch (err) {
          alert('Update failed');
          setStatus('available');
      } finally {
          setUpdating(false);
          clearInterval(interval);
      }
  };

  const handleApply = async () => {
      setStatus('applying');
      try {
          const token = useAuthStore.getState().token;
          const res = await fetch('/api/updates/apply', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({ 
                  commitSha: updateData.commitSha,
                  updatePath: updateData.updatePath
              })
          });
          if (res.ok) {
              setStatus('success');
              alert('Update applied successfully! The website is now updated.');
              window.location.reload();
          }
      } catch (err) {
          alert('Failed to apply update');
          setStatus('extracted');
      }
  };

  return (
    <DashboardLayout role={user?.role || 'admin'}>
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Updates</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Keep your Code Lab platform up to date with the latest features and security patches.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Status Card */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "p-4 rounded-2xl bg-indigo-500/10 text-indigo-500",
                                status === 'up-to-date' && "bg-emerald-500/10 text-emerald-500",
                                status === 'available' && "bg-amber-500/10 text-amber-500"
                            )}>
                                <RefreshCw className={cn(checking && "animate-spin")} size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {status === 'idle' && "Check for Updates"}
                                    {status === 'checking' && "Checking Server..."}
                                    {status === 'available' && `New Version Available! (v${updateInfo?.latest?.version || '?.?.?'})`}
                                    {status === 'up-to-date' && "System is Up to Date"}
                                    {status === 'downloading' && "Downloading Files..."}
                                    {status === 'extracted' && "Update Ready"}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {status === 'up-to-date' ? "You are running the latest version of Code Lab." : "Recommended update available from GitHub repository."}
                                </p>
                            </div>
                        </div>
                        {status !== 'downloading' && status !== 'extracted' && (
                            <button 
                                onClick={checkUpdates}
                                disabled={checking}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
                                Check Updates
                            </button>
                        )}
                    </div>

                    {status === 'downloading' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-slate-400">
                                <span>Downloading Package</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                                    style={{ width: `${progress}%` }} 
                                />
                            </div>
                        </div>
                    )}

                    {status === 'available' && updateInfo && (
                        <div className="space-y-4">
                            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                                <div className="flex items-start gap-4">
                                    <Info className="text-amber-500 mt-1" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">What's New in {updateInfo.latest.commit.substring(0,7)}</h3>
                                        <p className="text-sm text-slate-500 mt-1 italic">"{updateInfo.latest.message}"</p>
                                        
                                        {updateInfo.isDbUpdateRequired && (
                                            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3">
                                                <AlertCircle className="text-rose-500" size={18} />
                                                <p className="text-xs font-bold text-rose-500 uppercase tracking-tight">Database Schema Changes Detected</p>
                                            </div>
                                        )}

                                        <button 
                                            onClick={handleUpdate}
                                            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                                        >
                                            <Download size={16} />
                                            Download & Update Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'up-to-date' && (
                        <div className="mt-6 flex flex-col gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Database Maintenance</h4>
                                        <p className="text-xs text-slate-500">Force a database schema check/update if you encounter issues.</p>
                                    </div>
                                    <button 
                                        onClick={handleDbSync}
                                        disabled={dbSyncing}
                                        className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2"
                                    >
                                        <RefreshCw size={14} className={dbSyncing ? "animate-spin" : ""} />
                                        {dbSyncing ? 'Syncing...' : 'Update DB Schema'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'extracted' && (
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="text-emerald-500" size={32} />
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Files Ready</h3>
                                    <p className="text-sm text-slate-500">The update has been downloaded. Click below to replace system files and complete the update.</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleApply}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <RefreshCw size={18} />
                                Apply Update & Restart
                            </button>
                        </div>
                    )}

                    {status === 'applying' && (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <RefreshCw className="animate-spin text-indigo-500" size={48} />
                            <p className="font-bold text-slate-900 dark:text-white text-xl animate-pulse">Applying System Changes...</p>
                            <p className="text-sm text-slate-500">Please do not close this window.</p>
                        </div>
                    )}
                </div>

                {/* Change Log */}
                {updateInfo && (
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-8">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <History size={20} className="text-indigo-500" />
                            File Changes
                        </h3>
                        <div className="space-y-3">
                            {updateInfo.filesChanged.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <FileCode size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-mono truncate max-w-md">
                                            {file.filename}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 rounded">+{file.additions}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-rose-500/10 text-rose-500 rounded">-{file.deletions}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
                <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
                    <HardDriveDownload size={32} className="mb-4 opacity-50" />
                    <h3 className="font-bold text-lg mb-2">Current Version</h3>
                    <p className="text-3xl font-black mb-4">v{updateInfo?.current?.version || '1.0.0'}</p>
                    <div className="space-y-2 text-sm opacity-80">
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className="font-bold">Stable</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Channel</span>
                            <span className="font-bold">Production</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <AlertCircle size={18} className="text-amber-500" />
                        Update Policy
                    </h3>
                    <ul className="space-y-3 text-xs text-slate-500 leading-relaxed">
                        <li className="flex gap-2">
                            <ChevronRight size={14} className="flex-shrink-0 text-indigo-500" />
                            Updates are fetched directly from the official GitHub repository.
                        </li>
                        <li className="flex gap-2">
                            <ChevronRight size={14} className="flex-shrink-0 text-indigo-500" />
                            Database schema migrations run automatically on next system boot.
                        </li>
                        <li className="flex gap-2">
                            <ChevronRight size={14} className="flex-shrink-0 text-indigo-500" />
                            It is recommended to backup your database before a major update.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </FadeIn>
    </DashboardLayout>
  );
};

export default UpdateWebsite;
