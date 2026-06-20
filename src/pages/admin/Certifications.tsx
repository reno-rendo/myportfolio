import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/admin/ImageUpload';
import type { Certification } from '@/lib/db';

export function CertificationsPage() {
    const [items, setItems] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', awardedBy: '', credentials: '', imageUrl: '' });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/certifications');
            setItems(await res.json());
        } catch { /* ignore */ } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setFormData({ title: '', awardedBy: '', credentials: '', imageUrl: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Certification) => {
        setFormData({
            title: item.title,
            awardedBy: item.awardedBy,
            credentials: item.credentials || '',
            imageUrl: item.imageUrl || '',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/certifications?id=${editingId}` : '/api/certifications';
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
        if (!confirm('Delete this certification?')) return;
        await fetch(`/api/certifications?id=${id}`, { method: 'DELETE', credentials: 'include' });
        fetchData();
    };

    if (loading) return <div className="text-zinc-400">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Certifications</h1>
                    <p className="text-zinc-400">{items.length} certifications</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Add Certification
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit' : 'Add'} Certification</h2>
                            <button onClick={resetForm} className="text-zinc-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <Label>Title *</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Awarded By *</Label>
                                <Input value={formData.awardedBy} onChange={e => setFormData({ ...formData, awardedBy: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Credentials URL</Label>
                                <Input value={formData.credentials} onChange={e => setFormData({ ...formData, credentials: e.target.value })} />
                            </div>
                            <div>
                                <Label>Badge Image (200x200px recommended)</Label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt="" className="w-12 h-12 object-contain" />
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white truncate">{item.title}</h3>
                                <p className="text-sm text-zinc-400">{item.awardedBy}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-zinc-800">
                            {item.credentials && (
                                <a href={item.credentials} target="_blank" rel="noopener" className="p-2 text-zinc-400 hover:text-white"><ExternalLink size={16} /></a>
                            )}
                            <button onClick={() => handleEdit(item)} className="p-2 text-zinc-400 hover:text-blue-500"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="col-span-full text-center py-8 text-zinc-500">No certifications yet</div>
                )}
            </div>
        </div>
    );
}
