import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Tool } from '@/lib/db';

export function ToolsPage() {
    const [items, setItems] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ label: '', imageUrl: '' });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/tools');
            setItems(await res.json());
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setFormData({ label: '', imageUrl: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Tool) => {
        setFormData({
            label: item.label,
            imageUrl: item.imageUrl || '',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/tools?id=${editingId}` : '/api/tools';
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
        if (!confirm('Delete this tool?')) return;
        await fetch(`/api/tools?id=${id}`, { method: 'DELETE', credentials: 'include' });
        fetchData();
    };

    if (loading) return <div className="text-zinc-400">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tools & Technologies</h1>
                    <p className="text-zinc-400">{items.length} tools</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Add Tool
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit' : 'Add'} Tool</h2>
                            <button onClick={resetForm} className="text-zinc-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <Label>Label *</Label>
                                <Input value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Icon Image (SVG/PNG)</Label>
                                <ImageUpload
                                    value={formData.imageUrl}
                                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">{editingId ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-3 relative group">
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => handleEdit(item)} className="p-1.5 bg-zinc-800 rounded text-zinc-400 hover:text-blue-500"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-zinc-800 rounded text-zinc-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt="" className="w-12 h-12 object-contain" />
                        ) : (
                            <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center text-zinc-500 text-xs">No Icon</div>
                        )}
                        <span className="text-sm font-medium text-white text-center">{item.label}</span>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-full text-center py-8 text-zinc-500">No tools yet</div>
                )}
            </div>
        </div>
    );
}
