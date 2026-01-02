import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Code2, 
  Search, 
  Bell, 
  User,
  PanelLeftClose,
  PanelLeft,
  Users,
  BarChart3,
  ShieldCheck,
  FileCode2,
  FileText,
  PenTool,
  BellRing,
  RefreshCw
} from 'lucide-react';
import { cn } from '../../utils/cn';
import useAuthStore from '../../store/authStore';
import ThemeToggle from '../ui/ThemeToggle';

const DashboardLayout = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex transition-colors duration-300">
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-white dark:bg-black border-r border-slate-200 dark:border-white/10 transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? "w-64" : "w-20 hidden lg:flex",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/10">
          <Link to="/" className="flex items-center space-x-2 overflow-hidden">
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
               <Code2 className="h-5 w-5" />
            </div>
            <span className={cn("font-bold text-lg text-slate-900 dark:text-white transition-opacity duration-300", !sidebarOpen && "opacity-0 w-0")}>
              CodeLab
            </span>
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-500">
             <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <div className={cn("px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-opacity", !sidebarOpen && "opacity-0")}>
                Menu
            </div>
            <NavItem icon={<LayoutDashboard />} label="Overview" to="/dashboard" active={location.pathname === '/dashboard'} collapsed={!sidebarOpen} />
            <NavItem icon={<FileCode2 />} label="My Projects" to="/dashboard/pens" active={location.pathname === '/dashboard/pens'} collapsed={!sidebarOpen} />
            <NavItem icon={<FileText />} label="My Posts" to="/dashboard/posts" active={location.pathname === '/dashboard/posts'} collapsed={!sidebarOpen} />
            <NavItem icon={<PenTool />} label="New Project" to={`/dashboard/${role}/editor`} active={location.pathname === `/dashboard/${role}/editor`} collapsed={!sidebarOpen} />
            
            {/* Admin Section */}
            {role === 'admin' && (
                <>
                    <div className={cn("px-3 mt-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-red-500/80 transition-opacity", !sidebarOpen && "opacity-0")}>
                        Admin
                    </div>
                    <NavItem icon={<Users />} label="Users" to="/dashboard/admin/users" active={location.pathname === '/dashboard/admin/users'} collapsed={!sidebarOpen} />
                    <NavItem icon={<BarChart3 />} label="Analytics" to="/dashboard/admin/analytics" active={location.pathname === '/dashboard/admin/analytics'} collapsed={!sidebarOpen} />
                    <NavItem icon={<Code2 />} label="Script Update" to="/dashboard/admin/scripts" active={location.pathname === '/dashboard/admin/scripts'} collapsed={!sidebarOpen} />
                    <NavItem icon={<RefreshCw />} label="System Update" to="/dashboard/admin/updates" active={location.pathname === '/dashboard/admin/updates'} collapsed={!sidebarOpen} />
                    <NavItem icon={<ShieldCheck />} label="Security" to="/dashboard/admin/security" active={location.pathname === '/dashboard/admin/security'} collapsed={!sidebarOpen} />
                    <NavItem icon={<BellRing />} label="Notifications" to="/dashboard/admin/notifications" active={location.pathname === '/dashboard/admin/notifications'} collapsed={!sidebarOpen} />
                </>
            )}
            
            <div className="my-4 border-t border-slate-200 dark:border-white/10 mx-2"></div>
            
            <NavItem icon={<Settings />} label="Settings" to="/dashboard/settings" active={location.pathname === '/dashboard/settings'} collapsed={!sidebarOpen} />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10">
            <div className={cn("flex items-center space-x-3", !sidebarOpen && "justify-center")}>
                <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold flex-shrink-0">
                    {user?.username?.[0]?.toUpperCase()}
                </div>
                <div className={cn("flex-1 overflow-hidden transition-all duration-300", !sidebarOpen && "w-0 opacity-0 hidden")}>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.username}</p>
                    <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
                </div>
                <button 
                    onClick={logout}
                    className={cn("text-slate-400 hover:text-red-500 transition-colors", !sidebarOpen && "hidden")}
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <button 
                    onClick={toggleSidebar}
                    className="hidden lg:flex text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                >
                    {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center relative">
                    <Search className="h-4 w-4 absolute left-3 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        className="pl-10 pr-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border-none text-sm w-64 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4 relative">
                <ThemeToggle />
                <div className="relative">
                    <button 
                        onClick={() => setNotificationOpen(!notificationOpen)}
                        className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-black"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {notificationOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setNotificationOpen(false)} />
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h3>
                                    <span className="text-xs text-indigo-500 cursor-pointer hover:underline">Mark all as read</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="p-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">New Feature: Dark Mode</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try out the new dark mode theme!</p>
                                                <p className="text-[10px] text-slate-400 mt-2">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">Project Saved</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">"My Cool Project" was saved successfully.</p>
                                                <p className="text-[10px] text-slate-400 mt-2">1 day ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 border-t border-slate-200 dark:border-white/10 text-center">
                                    <Link to="/dashboard/notifications" className="text-xs text-slate-500 hover:text-indigo-500 block py-1">
                                        View all notifications
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 dark:border-white/10 text-center sm:text-left text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-black">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <p>&copy; 2025 CodeLab Inc. All rights reserved.</p>
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a href="#" className="hover:text-indigo-500">Privacy</a>
                    <a href="#" className="hover:text-indigo-500">Terms</a>
                    <a href="#" className="hover:text-indigo-500">Support</a>
                </div>
            </div>
        </footer>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to, active, collapsed }) => (
    <Link 
        to={to} 
        className={cn(
            "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
            active 
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white",
            collapsed && "justify-center"
        )}
        title={collapsed ? label : undefined}
    >
        <span className={cn("flex-shrink-0 transition-colors", active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300")}>
            {React.cloneElement(icon, { size: 20 })}
        </span>
        
        <span className={cn("ml-3 whitespace-nowrap transition-all duration-300 overflow-hidden", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
            {label}
        </span>

        {/* Tooltip for collapsed mode */}
        {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {label}
            </div>
        )}
    </Link>
);

export default DashboardLayout;