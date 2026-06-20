import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Palette, Globe, Layers, Smartphone, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Service } from '@/lib/db';

const ICONS = [
    { name: 'Palette', icon: Palette, label: 'Design' },
    { name: 'Globe', icon: Globe, label: 'Web' },
    { name: 'Layers', icon: Layers, label: 'Backend' },
    { name: 'Smartphone', icon: Smartphone, label: 'Mobile' },
    { name: 'Rocket', icon: Rocket, label: 'Launch' },
];

export function ServicesPage() {
    const [items, setItems] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', projectCount: '', iconName: 'Palette' });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/services');
            setItems(await res.json());
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setFormData({ title: '', description: '', projectCount: '', iconName: 'Palette' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Service) => {
        setFormData({
            title: item.title,
            description: item.description || '',
            projectCount: item.projectCount || '',
            iconName: item.iconName || 'Palette',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/services?id=${editingId}` : '/api/services';
            await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
            resetForm();
            fetchData();
        } catch { /* ignore */ }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this service?')) return;
        await fetch(`/api/services?id=${id}`, { method: 'DELETE', credentials: 'include' });
        fetchData();
    };

    if (loading) return <div className="text-zinc-400">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Services</h1>
                    <p className="text-zinc-400">{items.length} services</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Add Service
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit' : 'Add'} Service</h2>
                            <button onClick={resetForm} className="text-zinc-400 hover:text-white"><X size={20} /></button>
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
                            <div>
                                <Label>Project Count</Label>
                                <Input value={formData.projectCount} onChange={e => setFormData({ ...formData, projectCount: e.target.value })} placeholder="e.g. 10 Projects" />
                            </div>
                            <div>
                                <Label>Icon</Label>
                                <div className="grid grid-cols-5 gap-2 mt-2">
                                    {ICONS.map((icon) => {
                                        const Icon = icon.icon;
                                        const isSelected = formData.iconName === icon.name;
                                        return (
                                            <button
                                                type="button"
                                                key={icon.name}
                                                onClick={() => setFormData({ ...formData, iconName: icon.name })}
                                                className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-colors ${isSelected ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                                            >
                                                <Icon size={20} />
                                                <span className="text-[10px]">{icon.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">{editingId ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => {
                    const Icon = ICONS.find(i => i.name === item.iconName)?.icon || Palette;
                    return (
                        <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="bg-zinc-800 p-3 rounded-lg text-green-500">
                                    <Icon size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-zinc-400 hover:text-blue-500"><Pencil size={16} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{item.description}</p>
                            <span className="text-xs font-medium text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">{item.projectCount}</span>
                        </div>
                    );
                })}
                {items.length === 0 && (
                    <div className="col-span-full text-center py-8 text-zinc-500">No services yet</div>
                )}
            </div>
        </div>
    );
}
