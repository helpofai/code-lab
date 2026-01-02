import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/authStore';
import { FadeIn } from '../../components/ui/FadeIn';
import { Bell, Trash2, Send, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const Notifications = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'System Maintenance', message: 'Scheduled maintenance on Sunday at 2 AM UTC.', date: '2 hours ago' },
    { id: 2, type: 'success', title: 'New Feature Launched', message: 'Dark mode is now available for all users!', date: '1 day ago' },
    { id: 3, type: 'warning', title: 'High Server Load', message: 'CPU usage exceeded 80% on server-01.', date: '2 days ago' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState('info');

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newTitle || !newMessage) return;

    const newNotification = {
      id: Date.now(),
      type: newType,
      title: newTitle,
      message: newMessage,
      date: 'Just now'
    };

    setNotifications([newNotification, ...notifications]);
    setNewTitle('');
    setNewMessage('');
    alert('Notification sent successfully!');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <DashboardLayout role={user?.role}>
      <FadeIn>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Notification Center</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Manage system-wide alerts and announcements.</p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Admin Access
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Notification Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send Notification</h2>
              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['info', 'success', 'warning'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewType(type)}
                        className={cn(
                          "py-2 rounded-lg text-sm font-medium capitalize border transition-all",
                          newType === type 
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-500" 
                            : "border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    placeholder="e.g., System Update"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea 
                    rows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white resize-none"
                    placeholder="Enter notification details..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Broadcast
                </button>
              </form>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={cn(
                      "p-2 rounded-lg flex-shrink-0 h-fit",
                      notification.type === 'success' ? "bg-green-100 dark:bg-green-500/10" :
                      notification.type === 'warning' ? "bg-yellow-100 dark:bg-yellow-500/10" :
                      "bg-blue-100 dark:bg-blue-500/10"
                    )}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{notification.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{notification.message}</p>
                      <span className="text-xs text-slate-400 mt-2 block">{notification.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No active notifications.</p>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </DashboardLayout>
  );
};

export default Notifications;
