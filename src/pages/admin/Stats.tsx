
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Stat } from '@/lib/db';

export function StatsPage() {
    const [items, setItems] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        number: '',
        label: '',
    });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const resetForm = () => {
        setFormData({ number: '', label: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Stat) => {
        setFormData({
            number: item.number,
            label: item.label,
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await fetch(`/api/stats?id=${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                await fetch('/api/stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this stat?')) return;
        try {
            await fetch(`/api/stats?id=${id}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    if (loading) return <div className="text-zinc-400">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Stats</h1>
                    <p className="text-zinc-400">{items.length} items</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Add Stat
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit' : 'Add'} Stat</h2>
                            <button onClick={resetForm} className="text-zinc-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <Label>Number *</Label>
                                <Input value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} placeholder="e.g. 10+" required />
                            </div>
                            <div>
                                <Label>Label *</Label>
                                <Input value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="e.g. Projects Done" required />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">{editingId ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                                <BarChart size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-xl">{item.number}</h3>
                                <p className="text-sm text-zinc-400">{item.label}</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-zinc-800 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-zinc-800 rounded"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="col-span-full border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                        No stats added yet. Click "Add Stat" to create one.
                    </div>
                )}
            </div>
        </div>
    );
}
