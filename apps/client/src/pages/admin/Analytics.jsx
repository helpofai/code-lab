import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/authStore';
import { FadeIn } from '../../components/ui/FadeIn';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { 
    Users, Layout, FileText, TrendingUp, 
    BarChart3, Eye, ArrowUpRight, Heart,
    PieChart as PieIcon, Tag, Flame
} from 'lucide-react';
import { 
    XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { cn } from '../../utils/cn';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Analytics = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = useAuthStore.getState().token;
        const res = await fetch('/api/analytics/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout role={user?.role || 'admin'}>
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="text-indigo-500" />
            Platform Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Detailed insights into user roles, content creation, and engagement.
          </p>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Users" value={data?.summary.users} icon={<Users size={20} />} color="blue" />
            <StatsCard title="Platform Views" value={data?.summary.totalViews} icon={<Eye size={20} />} color="emerald" />
            <StatsCard title="Total Likes" value={data?.summary.likes} icon={<Heart size={20} />} color="rose" />
            <StatsCard title="Total Content" value={data?.summary.pens + data?.summary.posts} icon={<Flame size={20} />} color="amber" />
        </div>

        {/* Charts Row 1: Content Trend & Role Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Content Trend Bar Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={18} className="text-indigo-500" />
                    Creation Trend (Pens vs Posts)
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data?.contentTrend}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="pens" fill="#6366f1" radius={[4, 4, 0, 0]} name="Pens Created" />
                            <Bar dataKey="posts" fill="#10b981" radius={[4, 4, 0, 0]} name="Blog Posts" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Role Distribution Pie Chart */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <PieIcon size={18} className="text-indigo-500" />
                    User Roles
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data?.roleDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                                nameKey="role"
                            >
                                {data?.roleDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Popular Content & Tags Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Posts */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Flame size={18} className="text-orange-500" />
                    Top Blog Posts
                </h3>
                <div className="space-y-4">
                    {data?.topContent.posts.map((post, i) => (
                        <div key={post.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="text-xs font-bold text-slate-400 w-4">{i+1}</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</p>
                                    <p className="text-[10px] text-slate-500">by @{post.user?.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                <Eye size={12} />
                                {post.views}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Tag size={18} className="text-indigo-500" />
                    Popular Topics
                </h3>
                <div className="flex flex-wrap gap-3">
                    {data?.topTags.map((tag) => (
                        <div key={tag.name} className="group relative">
                            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-500 hover:text-white transition-all rounded-xl border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-2">
                                <span className="text-sm font-bold capitalize">{tag.name}</span>
                                <span className="text-[10px] bg-white/20 px-1.5 rounded-md">{tag.count}</span>
                            </div>
                        </div>
                    ))}
                    {data?.topTags.length === 0 && (
                        <p className="text-slate-500 text-sm italic">No tags used yet.</p>
                    )}
                </div>
            </div>
        </div>
      </FadeIn>
    </DashboardLayout>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", 
                color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" :
                color === 'rose' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
            )}>
                {icon}
            </div>
            <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</h4>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{value?.toLocaleString()}</p>
            </div>
        </div>
    </div>
);

export default Analytics;