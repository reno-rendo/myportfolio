import { useAuth } from '@/contexts/AuthContext';
import { FolderOpen, Briefcase, BookOpen, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Stats {
    projects: number;
    experience: number;
    publications: number;
    certifications: number;
}

export function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Stats>({ projects: 0, experience: 0, publications: 0, certifications: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projectsRes, experienceRes, publicationsRes, certificationsRes] = await Promise.all([
                    fetch('/api/projects'),
                    fetch('/api/experience'),
                    fetch('/api/publications'),
                    fetch('/api/certifications'),
                ]);

                const [projects, experience, publications, certifications] = await Promise.all([
                    projectsRes.json(),
                    experienceRes.json(),
                    publicationsRes.json(),
                    certificationsRes.json(),
                ]);

                setStats({
                    projects: projects.length,
                    experience: experience.length,
                    publications: publications.length,
                    certifications: certifications.length,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'green', to: '/admin/projects' },
        { label: 'Experience', value: stats.experience, icon: Briefcase, color: 'blue', to: '/admin/experience' },
        { label: 'Publications', value: stats.publications, icon: BookOpen, color: 'purple', to: '/admin/publications' },
        { label: 'Certifications', value: stats.certifications, icon: Award, color: 'amber', to: '/admin/certifications' },
    ];

    const colorClasses: Record<string, string> = {
        green: 'bg-green-500/10 text-green-500 border-green-500/20',
        blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
                <p className="text-zinc-400">Welcome back, {user?.username}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        to={card.to}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg border ${colorClasses[card.color]}`}>
                                <card.icon size={20} />
                            </div>
                            <TrendingUp size={16} className="text-zinc-600 group-hover:text-green-500 transition-colors" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {loading ? '...' : card.value}
                        </div>
                        <div className="text-sm text-zinc-400">{card.label}</div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Link to="/admin/projects" className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                        <FolderOpen className="text-green-500" size={24} />
                        <span className="text-sm text-zinc-300">Manage Projects</span>
                    </Link>
                    <Link to="/admin/experience" className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                        <Briefcase className="text-blue-500" size={24} />
                        <span className="text-sm text-zinc-300">Edit Experience</span>
                    </Link>
                    <Link to="/admin/publications" className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                        <BookOpen className="text-purple-500" size={24} />
                        <span className="text-sm text-zinc-300">Publications</span>
                    </Link>
                    <Link to="/" target="_blank" className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors">
                        <TrendingUp className="text-amber-500" size={24} />
                        <span className="text-sm text-zinc-300">View Portfolio</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
