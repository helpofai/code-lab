import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/authStore';
import { getAllUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../../services/userService';
import { FadeIn } from '../../components/ui/FadeIn';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import Modal from '../../components/ui/Modal';
import { 
    User, Shield, Mail, Calendar, Trash2, 
    CheckCircle2, UserCog, UserPlus, Edit, 
    MoreVertical, Ban, CheckCircle, Search, 
    ShieldCheck, ShieldAlert, XCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';

const UserManagement = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
      try {
          const res = await toggleUserStatus(userId);
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: res.status } : u));
      } catch (err) {
          alert(err.message);
      }
  };

  const handleDelete = async (userId) => {
      if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) return;
      try {
          await deleteUser(userId);
          setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (err) {
          alert(err.message);
      }
  }

  const handleVerify = async (user) => {
      try {
          const newVerifiedStatus = !user.isVerified;
          await updateUser(user.id, { ...user, isVerified: newVerifiedStatus });
          setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isVerified: newVerifiedStatus } : u));
      } catch (err) {
          alert(err.message);
      }
  }

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout role={currentUser?.role || 'admin'}>
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Management</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Advanced control over platform access and permissions.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
            </div>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
                <UserPlus size={18} />
                <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[30%]">User</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[15%]">Role</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[15%]">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-[15%]">Verification</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-slate-900 dark:text-white truncate">{user.username}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                        user.role === 'admin' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                        user.role === 'paid-user' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                        "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "flex items-center gap-1.5 text-xs font-medium",
                                        user.status === 'active' ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        <div className={cn("h-1.5 w-1.5 rounded-full", user.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                                        {user.status === 'active' ? 'Active' : 'Suspended'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleVerify(user)}
                                        className={cn(
                                            "flex items-center gap-1.5 text-[10px] font-bold uppercase py-1 px-2 rounded-md transition-all",
                                            user.isVerified 
                                                ? "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20" 
                                                : "text-slate-400 bg-slate-400/10 border border-slate-400/20 hover:text-white hover:bg-indigo-500 hover:border-indigo-500"
                                        )}
                                    >
                                        {user.isVerified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                        {user.isVerified ? 'Verified' : 'Verify'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-all"
                                            title="Edit Details"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleToggleStatus(user.id)}
                                            className={cn(
                                                "p-2 rounded-lg transition-all",
                                                user.status === 'active' 
                                                    ? "text-slate-400 hover:text-amber-500 hover:bg-amber-500/10" 
                                                    : "text-emerald-500 hover:bg-emerald-500/10"
                                            )}
                                            title={user.status === 'active' ? "Suspend User" : "Activate User"}
                                        >
                                            {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            disabled={user.id === currentUser?.id}
                                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all disabled:opacity-20"
                                            title="Delete Account"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modals */}
        <AddUserModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onSuccess={fetchUsers} 
        />
        
        {selectedUser && (
            <EditUserModal 
                isOpen={isEditModalOpen} 
                onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }} 
                user={selectedUser}
                onSuccess={fetchUsers} 
            />
        )}
      </FadeIn>
    </DashboardLayout>
  );
};

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', role: 'user', isVerified: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createUser(formData);
            onSuccess();
            onClose();
            setFormData({ username: '', email: '', password: '', role: 'user', isVerified: false });
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New User">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <InputField label="Username" placeholder="johndoe" required value={formData.username} onChange={v => setFormData({...formData, username: v})} />
                    <InputField label="Email Address" type="email" placeholder="john@example.com" required value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                    <InputField label="Password" type="password" placeholder="••••••••" required value={formData.password} onChange={v => setFormData({...formData, password: v})} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Role</label>
                            <select 
                                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="user">User</option>
                                <option value="member">Member</option>
                                <option value="paid-user">Paid User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Verification</label>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, isVerified: !formData.isVerified})}
                                className={cn(
                                    "w-full py-2 rounded-lg text-sm font-bold transition-all border",
                                    formData.isVerified 
                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                        : "bg-slate-500/10 text-slate-400 border-white/5"
                                )}
                            >
                                {formData.isVerified ? 'Verified' : 'Unverified'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: user.username, 
        email: user.email, 
        role: user.role, 
        isVerified: user.isVerified,
        status: user.status
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUser(user.id, formData);
            onSuccess();
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user.username}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField label="Username" value={formData.username} onChange={v => setFormData({...formData, username: v})} />
                <InputField label="Email Address" type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Role</label>
                        <select 
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="user">User</option>
                            <option value="member">Member</option>
                            <option value="paid-user">Paid User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                        <select 
                            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                    <input 
                        type="checkbox" 
                        id="verify-check"
                        checked={formData.isVerified}
                        onChange={e => setFormData({...formData, isVerified: e.target.checked})}
                        className="h-4 w-4 rounded border-white/10 bg-[#2a2a2a] text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="verify-check" className="text-sm text-slate-300">Mark user as verified</label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

const InputField = ({ label, type = "text", placeholder, required, value, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</label>
        <input 
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
        />
    </div>
);

export default UserManagement;