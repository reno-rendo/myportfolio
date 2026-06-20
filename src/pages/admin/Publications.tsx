import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Publication } from '@/lib/db';

export function PublicationsPage() {
    const [items, setItems] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', conference: '', url: '', doi: '', description: '' });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/publications');
            setItems(await res.json());
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setFormData({ title: '', conference: '', url: '', doi: '', description: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Publication) => {
        setFormData({
            title: item.title,
            conference: item.conference,
            url: item.url || '',
            doi: item.doi || '',
            description: item.description || '',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/publications?id=${editingId}` : '/api/publications';
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
        if (!confirm('Delete this publication?')) return;
        await fetch(`/api/publications?id=${id}`, { method: 'DELETE', credentials: 'include' });
        fetchData();
    };

    if (loading) return <div className="text-zinc-400">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Publications</h1>
                    <p className="text-zinc-400">{items.length} publications</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Add Publication
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit' : 'Add'} Publication</h2>
                            <button onClick={resetForm} className="text-zinc-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <Label>Title *</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Conference / Journal *</Label>
                                <Input value={formData.conference} onChange={e => setFormData({ ...formData, conference: e.target.value })} required />
                            </div>
                            <div>
                                <Label>URL</Label>
                                <Input value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} />
                            </div>
                            <div>
                                <Label>DOI</Label>
                                <Input value={formData.doi} onChange={e => setFormData({ ...formData, doi: e.target.value })} />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">{editingId ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-medium text-white">{item.title}</h3>
                                <p className="text-sm text-zinc-400 mt-1">{item.conference}</p>
                                {item.description && <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{item.description}</p>}
                            </div>
                            <div className="flex gap-2 ml-4">
                                {item.url && (
                                    <a href={item.url} target="_blank" rel="noopener" className="p-2 text-zinc-400 hover:text-white"><ExternalLink size={16} /></a>
                                )}
                                <button onClick={() => handleEdit(item)} className="p-2 text-zinc-400 hover:text-blue-500"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <div className="text-center py-8 text-zinc-500">No publications yet</div>}
            </div>
        </div>
    );
}
