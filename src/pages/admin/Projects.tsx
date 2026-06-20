
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Project, Tool } from '@/lib/db';

export function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        techStack: '',
        imageUrl: '',
        repoUrl: '',
        liveUrl: '',
        category: '',
    });

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch Projects
        fetchProjects();

        // Fetch Tools for selection
        fetch('/api/tools')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTools(data);
            })
            .catch(console.error);
    }, []);

    const resetForm = () => {
        setFormData({ title: '', description: '', techStack: '', imageUrl: '', repoUrl: '', liveUrl: '', category: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (project: Project) => {
        setFormData({
            title: project.title,
            description: project.description || '',
            techStack: project.techStack?.join(', ') || '',
            imageUrl: project.imageUrl || '',
            repoUrl: project.repoUrl || '',
            liveUrl: project.liveUrl || '',
            category: project.category || '',
        });
        setEditingId(project.id);
        setShowForm(true);
    };

    const toggleTech = (label: string) => {
        const current = formData.techStack ? formData.techStack.split(',').map(s => s.trim()).filter(Boolean) : [];
        let updated;
        if (current.includes(label)) {
            updated = current.filter(l => l !== label);
        } else {
            updated = [...current, label];
        }
        setFormData({ ...formData, techStack: updated.join(',') });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const body = {
            ...formData,
            techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        };

        try {
            if (editingId) {
                await fetch(`/api/projects/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: 'include',
                });
            } else {
                await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: 'include',
                });
            }
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE', credentials: 'include' });
            fetchProjects();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    if (loading) {
        return <div className="text-zinc-400">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Projects</h1>
                    <p className="text-zinc-400">{projects.length} projects</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Add Project
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">
                                {editingId ? 'Edit Project' : 'Add Project'}
                            </h2>
                            <button onClick={resetForm} className="text-zinc-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <Label>Title *</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                            </div>

                            {/* Tech Stack Selection */}
                            <div>
                                <Label>Tech Stack (Select Icons)</Label>
                                <div className="flex flex-wrap gap-2 mt-2 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                                    {tools.length === 0 && <p className="text-zinc-500 text-sm">No tools available. Add them in Tools & Tech page.</p>}
                                    {tools.map(tool => {
                                        const isSelected = formData.techStack.split(',').map(s => s.trim()).includes(tool.label);
                                        return (
                                            <button
                                                key={tool.id}
                                                type="button"
                                                onClick={() => toggleTech(tool.label)}
                                                className={`
                                                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                                                    ${isSelected
                                                        ? 'bg-green-600 border-green-500 text-white shadow-[0_0_10px_rgba(22,163,74,0.3)]'
                                                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'}
                                                `}
                                            >
                                                {tool.imageUrl ? (
                                                    <img src={tool.imageUrl} alt="" className="w-5 h-5 object-contain" />
                                                ) : null}
                                                <span className="text-sm">{tool.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">Selected techs will be displayed as icons in Project Card.</p>
                            </div>

                            <div>
                                <Label>Project Image (800x600px recommended)</Label>
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Repo URL</Label>
                                    <Input value={formData.repoUrl} onChange={e => setFormData({ ...formData, repoUrl: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Live URL</Label>
                                    <Input value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <Label>Category</Label>
                                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Fullstack, Frontend, Research" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                                    {editingId ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-800/50">
                        <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium text-zinc-400">Project</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-zinc-400 hidden md:table-cell">Category</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-zinc-400 hidden lg:table-cell">Tech Stack</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-zinc-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-zinc-800/30">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {project.imageUrl && (
                                            <img src={project.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                                        )}
                                        <div>
                                            <p className="font-medium text-white">{project.title}</p>
                                            <p className="text-sm text-zinc-500 line-clamp-1">{project.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <span className="text-sm text-zinc-400">{project.category || '-'}</span>
                                </td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {project.techStack?.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">{tech}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener" className="p-2 text-zinc-400 hover:text-white">
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        <button onClick={() => handleEdit(project)} className="p-2 text-zinc-400 hover:text-blue-500">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2 text-zinc-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                                    No projects yet. Add your first project!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
