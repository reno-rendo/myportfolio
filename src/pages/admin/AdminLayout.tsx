import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    FolderOpen,
    Briefcase,
    BookOpen,
    Award,
    Settings,
    LogOut,
    Menu,
    X,
    Hammer,
    Zap,
    BarChart, // Added BarChart
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Projects', to: '/admin/projects', icon: FolderOpen },
    { label: 'Services', to: '/admin/services', icon: Zap },
    { label: 'Tools', to: '/admin/tools', icon: Hammer },
    { label: 'Experience', to: '/admin/experience', icon: Briefcase },
    { label: 'Publications', to: '/admin/publications', icon: BookOpen },
    { label: 'Certifications', to: '/admin/certifications', icon: Award },
    { label: 'Stats', to: '/admin/stats', icon: BarChart }, // Added Stats
    { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
    const { user, loading, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                        <Link to="/admin" className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-green-500">⚡</span> Admin
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.to;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                        }
                  `}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3 mb-3">
                            {user.avatarUrl && (
                                <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.username}</p>
                                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col min-h-screen">
                {/* Mobile header */}
                <header className="lg:hidden sticky top-0 z-30 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white">
                        <Menu size={24} />
                    </button>
                    <span className="text-white font-semibold">Admin Panel</span>
                </header>

                {/* Page content */}
                <div className="flex-1 p-6">
                    <React.Suspense fallback={
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    }>
                        <Outlet />
                    </React.Suspense>
                </div>
            </main>
        </div>
    );
}
