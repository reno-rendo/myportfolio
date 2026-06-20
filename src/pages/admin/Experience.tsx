import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Experience } from '@/lib/db';

export function ExperiencePage() {
    const [items, setItems] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        type: 'work' as 'work' | 'education',
        year: '',
        title: '',
        institute: '',
        description: '',
    });

    const fetchData = async () => {
        try {
            const res = await fetch('/api/experience');
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
        setFormData({ type: 'work', year: '', title: '', institute: '', description: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (item: Experience) => {
        setFormData({
            type: item.type as 'work' | 'education',
            year: item.year,
            title: item.title,
            institute: item.institute,
            description: item.description || '',
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await fetch(`/api/experience?id=${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                });
            } else {
                await fetch('/api/experience', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                });
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Failed to save:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this entry?')) return;
        try {
            await fetch(`/api/experience?id=${id}`, { method: 'DELETE', credentials: 'include' });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const workItems = items.filter(i => i.type === 'work');
    const educationItems = items.filter(i => i.type === 'education');

    if (loading) return <div className="text-zinc-400">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Experience</h1>
                    <p className="text-zinc-400">{items.length} entries</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus size={18} className="mr-2" /> Add Entry
                </Button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-lg">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit' : 'Add'} Entry</h2>
                            <button onClick={resetForm} className="text-zinc-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <Label>Type *</Label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as 'work' | 'education' })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="work">Work Experience</option>
                                    <option value="education">Education</option>
                                </select>
                            </div>
                            <div>
                                <Label>Year / Duration *</Label>
                                <Input value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} placeholder="2023 - Present" required />
                            </div>
                            <div>
                                <Label>Title / Role *</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Company / Institution *</Label>
                                <Input value={formData.institute} onChange={e => setFormData({ ...formData, institute: e.target.value })} required />
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

            {/* Work Experience */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Work Experience</h2>
                <div className="space-y-3">
                    {workItems.map(item => (
                        <div key={item.id} className="flex items-start justify-between p-3 bg-zinc-800/50 rounded-lg">
                            <div>
                                <p className="font-medium text-white">{item.title}</p>
                                <p className="text-sm text-zinc-400">{item.institute}</p>
                                <p className="text-xs text-zinc-500">{item.year}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 text-zinc-400 hover:text-blue-500"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {workItems.length === 0 && <p className="text-zinc-500 text-sm">No work experience added</p>}
                </div>
            </div>

            {/* Education */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Education</h2>
                <div className="space-y-3">
                    {educationItems.map(item => (
                        <div key={item.id} className="flex items-start justify-between p-3 bg-zinc-800/50 rounded-lg">
                            <div>
                                <p className="font-medium text-white">{item.title}</p>
                                <p className="text-sm text-zinc-400">{item.institute}</p>
                                <p className="text-xs text-zinc-500">{item.year}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 text-zinc-400 hover:text-blue-500"><Pencil size={16} /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-zinc-400 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {educationItems.length === 0 && <p className="text-zinc-500 text-sm">No education added</p>}
                </div>
            </div>
        </div>
    );
}
