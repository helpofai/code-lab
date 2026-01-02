import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import DashboardLayout from '../components/layout/DashboardLayout';
import { FadeIn } from '../components/ui/FadeIn';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { Users, Activity, DollarSign, Server, Settings, ShieldAlert, Lock, Cloud, Star, Zap, PenTool, Layout } from 'lucide-react';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  // Fallback if user is not loaded yet
  if (!user) {
      return (
          <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex items-center justify-center text-slate-500">
              Loading...
          </div>
      )
  }

  const role = user.role || 'user';

  return (
    <DashboardLayout role={role}>
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                    Dashboard
                    {role === 'admin' && <Badge color="red">Admin</Badge>}
                    {role === 'paid-user' && <Badge color="indigo">Pro</Badge>}
                    {role === 'member' && <Badge color="emerald">Member</Badge>}
                    {role === 'user' && <Badge color="slate">Free</Badge>}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Welcome back, {user.username}. Here is your overview.
                </p>
            </div>
            
            <Link to={`/dashboard/${role}/editor`}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                    <PenTool className="h-4 w-4" />
                    New Project
                </button>
            </Link>
          </div>

          {/* Render content based on Role */}
          {role === 'admin' && <AdminView />}
          {role === 'paid-user' && <PaidUserView />}
          {role === 'member' && <MemberView />}
          {role === 'user' && <FreeUserView role={role} />}
          
        </FadeIn>
    </DashboardLayout>
  );
};

// --- Role Specific Views ---

const AdminView = () => {
    const stats = [
        { title: "Total Users", value: "12,345", icon: <Users className="h-4 w-4" />, change: "+12%" },
        { title: "Revenue", value: "$45.2k", icon: <DollarSign className="h-4 w-4" />, change: "+8%" },
        { title: "System Health", value: "99.9%", icon: <Activity className="h-4 w-4 text-green-500" />, change: "Stable" },
        { title: "Active Pens", value: "8,502", icon: <Layout className="h-4 w-4" />, change: "+24%" },
    ];

    const items = [
        {
          title: "User Management",
          description: "Manage roles, bans, and permissions.",
          header: <Skeleton bg="bg-red-500/10" />,
          icon: <Users className="h-4 w-4 text-slate-500" />,
          className: "md:col-span-2",
        },
        {
          title: "System Settings",
          description: "Global config and feature flags.",
          header: <Skeleton bg="bg-slate-500/10" />,
          icon: <Settings className="h-4 w-4 text-slate-500" />,
          className: "md:col-span-1",
        },
        {
          title: "Security Logs",
          description: "Monitor access and threats.",
          header: <Skeleton bg="bg-orange-500/10" />,
          icon: <ShieldAlert className="h-4 w-4 text-slate-500" />,
          className: "md:col-span-1",
        },
    ];

    return (
        <div className="space-y-8">
            <StatsGrid stats={stats} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Administration</h2>
            <BentoGrid>
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={item.header}
                        icon={item.icon}
                        className={item.className}
                    />
                ))}
            </BentoGrid>
        </div>
    );
};

const PaidUserView = () => {
     const stats = [
        { title: "Private Pens", value: "12/Infinite", icon: <Lock className="h-4 w-4" /> },
        { title: "Storage Used", value: "2.4GB", icon: <Cloud className="h-4 w-4" />, change: "10GB Limit" },
        { title: "Views", value: "1,203", icon: <Activity className="h-4 w-4" />, change: "+15% this week" },
    ];
    
    const items = [
        {
          title: "Private Projects",
          description: "Access your 12 hidden projects.",
          header: <Skeleton bg="bg-indigo-500/10" />,
          icon: <Lock className="h-4 w-4 text-indigo-500" />,
          className: "md:col-span-2",
        },
        {
          title: "Asset Library",
          description: "Manage your uploaded images and fonts.",
          header: <Skeleton bg="bg-slate-500/10" />,
          icon: <Cloud className="h-4 w-4 text-slate-500" />,
          className: "md:col-span-1",
        },
        {
          title: "Pro Templates",
          description: "Premium starter kits.",
          header: <Skeleton bg="bg-yellow-500/10" />,
          icon: <Star className="h-4 w-4 text-yellow-500" />,
          className: "md:col-span-1",
        },
    ];

    return (
        <div className="space-y-8">
             <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 mt-0.5 text-yellow-300" />
                    <div>
                        <h3 className="font-bold">Pro Member Active</h3>
                        <p className="text-indigo-100 text-sm">Your next billing date is January 31, 2026.</p>
                    </div>
                </div>
            </div>
            <StatsGrid stats={stats} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pro Workspace</h2>
            <BentoGrid>
                {items.map((item, i) => (
                    <BentoGridItem
                        key={i}
                        title={item.title}
                        description={item.description}
                        header={item.header}
                        icon={item.icon}
                        className={item.className}
                    />
                ))}
            </BentoGrid>
        </div>
    );
};

const MemberView = () => {
    const stats = [
        { title: "Community Pens", value: "450", icon: <Globe className="h-4 w-4" /> },
        { title: "Collaborations", value: "5", icon: <Users className="h-4 w-4" /> },
        { title: "Badges", value: "3", icon: <Star className="h-4 w-4 text-yellow-500" /> },
    ];

    return (
        <div className="space-y-8">
            <StatsGrid stats={stats} />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Community Member Area</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/5 hover:border-emerald-500 transition-colors">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Users className="h-5 w-5 text-emerald-500" />
                        Active Discussions
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">Engage with other members in the community forums.</p>
                    <button className="text-emerald-600 font-bold text-sm hover:underline">Join the conversation →</button>
                </div>
                <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Member Rewards</h3>
                    <p className="text-slate-500 text-sm">You have 250 points. Earn more by contributing code.</p>
                </div>
            </div>
        </div>
    );
}

const FreeUserView = ({ role }) => {
    return (
        <div className="space-y-8">
            <div className="p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">Upgrade to Pro</h3>
                        <p className="text-indigo-700 dark:text-indigo-300 max-w-xl">
                            Unlock private pens, asset hosting, and real-time collaboration tools. 
                            Join thousands of professional developers building better software.
                        </p>
                    </div>
                    <Link to="/#pricing">
                        <button className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-500/20">
                            Get Pro - $12/mo
                        </button>
                    </Link>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer">
                         <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                            <Layout className="h-8 w-8" />
                         </div>
                         <h3 className="font-bold text-slate-900 dark:text-white">Untitled Project {i}</h3>
                         <p className="text-sm text-slate-500">Edited 2 days ago</p>
                     </div>
                 ))}
                 <Link to={`/dashboard/${role}/editor`} className="flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors cursor-pointer group">
                     <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                         <PenTool className="h-6 w-6" />
                     </div>
                     <span className="font-medium text-slate-900 dark:text-white">Create New Pen</span>
                 </Link>
            </div>
        </div>
    );
};

// --- Shared Components ---

const StatsGrid = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-500 text-sm font-medium">{stat.title}</span>
                    <span className="text-slate-400">{stat.icon}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                {stat.change && <div className="text-xs text-green-500 mt-1 font-medium">{stat.change}</div>}
            </div>
        ))}
    </div>
);

const Badge = ({ children, color }) => {
    const colors = {
        red: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-200 dark:border-red-500/30",
        indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
        slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    };
    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide", colors[color])}>
            {children}
        </span>
    );
};

const Skeleton = ({ bg }) => (
    <div className={cn("flex flex-1 w-full h-full min-h-[6rem] rounded-xl animate-pulse", bg)}></div>
);

export default Dashboard;
