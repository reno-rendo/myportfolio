
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import type { Tool } from '@/lib/db';

interface ProfileData {
    name: string;
    bio: string;
    email: string;
    linkedin: string;
    github: string;
    avatarUrl: string;
    specialization: string;
    location: string;
    about?: string;
    resumeUrl?: string;
}

export function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [tools, setTools] = useState<Tool[]>([]);

    const [formData, setFormData] = useState<ProfileData>({
        name: '',
        bio: '',
        email: '',
        linkedin: '',
        github: '',
        avatarUrl: '',
        specialization: '',
        location: '',
    });

    // Fetch data
    useEffect(() => {
        async function loadData() {
            try {
                // Feature: Fetch Profile
                const profileRes = await fetch('/api/profile');
                const profileData = await profileRes.json();

                if (profileData) {
                    setFormData({
                        name: profileData.name || '',
                        bio: profileData.bio || '',
                        email: profileData.email || '',
                        linkedin: profileData.linkedin || '',
                        github: profileData.github || '',
                        avatarUrl: profileData.avatarUrl || '',
                        specialization: profileData.specialization || '',
                        location: profileData.location || '',
                        about: profileData.about || '',
                        resumeUrl: profileData.resumeUrl || '',
                    });
                }

                // Feature: Fetch Tools for Specialization
                const toolsRes = await fetch('/api/tools');
                const toolsData = await toolsRes.json();
                if (Array.isArray(toolsData)) {
                    setTools(toolsData);
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const toggleTool = (label: string) => {
        const current = formData.specialization
            ? formData.specialization.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        let updated;
        if (current.includes(label)) {
            updated = current.filter(l => l !== label);
        } else {
            updated = [...current, label];
        }
        setFormData({ ...formData, specialization: updated.join(',') });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert('Failed to save profile');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-zinc-400">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-zinc-400">Manage your profile and preferences</p>
            </div>

            {/* User Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
                <div className="flex items-center gap-4">
                    {user?.avatarUrl && (
                        <img src={user.avatarUrl} alt="" className="w-16 h-16 rounded-full" />
                    )}
                    <div>
                        <p className="font-medium text-white">{user?.username}</p>
                        <p className="text-sm text-zinc-400">{user?.email || 'No email'}</p>
                        <p className="text-xs text-zinc-500 mt-1">Logged in via GitHub</p>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Portfolio Profile</h2>
                <div className="space-y-4 max-w-xl">
                    <div>
                        <Label>Profile Photo (400x400px recommended)</Label>
                        <ImageUpload
                            value={formData.avatarUrl}
                            onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                        />
                    </div>
                    <div>
                        <Label>Display Name</Label>
                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your Name" />
                    </div>

                    {/* Specialization Selection */}
                    <div>
                        <Label>Specialization (Select Icons)</Label>
                        <div className="flex flex-wrap gap-2 mt-2 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
                            {tools.length === 0 && <p className="text-zinc-500 text-sm">No tools available. Add them in Tools & Tech page.</p>}
                            {tools.map(tool => {
                                const isSelected = formData.specialization.split(',').map(s => s.trim()).includes(tool.label);
                                return (
                                    <button
                                        key={tool.id}
                                        type="button"
                                        onClick={() => toggleTool(tool.label)}
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
                        <p className="text-xs text-zinc-500 mt-2">Selected items will be displayed below your name in Home.</p>
                    </div>

                    <div>
                        <Label>Based in (Location)</Label>
                        <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Kupang, Indonesia" />
                    </div>
                    <div>
                        <Label>About (Introduction)</Label>
                        <Textarea
                            value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            placeholder="Short bio (displayed in Hero/Profile)"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Short bio for Hero section</p>
                    </div>
                    <div>
                        <Label>Detailed About Me</Label>
                        <Textarea
                            value={formData.about || ''}
                            onChange={e => setFormData({ ...formData, about: e.target.value })}
                            rows={6}
                            placeholder="Long description for About section..."
                        />
                    </div>
                    <div>
                        <Label>Resume URL (Download Link)</Label>
                        <Input value={formData.resumeUrl || ''} onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })} placeholder="Google Drive link or /uploads/resume.pdf" />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                        <Label>LinkedIn URL</Label>
                        <Input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div>
                        <Label>GitHub URL</Label>
                        <Input value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} placeholder="https://github.com/..." />
                    </div>
                    <div className="pt-4">
                        <Button type="submit" disabled={saving} className={saved ? "bg-green-600" : "bg-green-600 hover:bg-green-700"}>
                            {saving ? (
                                <><Loader2 className="animate-spin mr-2" size={18} /> Saving...</>
                            ) : saved ? (
                                <><CheckCircle className="mr-2" size={18} /> Saved!</>
                            ) : (
                                <><Save className="mr-2" size={18} /> Save Changes</>
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Environment Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Environment</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Database</span>
                        <span className="text-green-500">SQLite (Local)</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Authentication</span>
                        <span className="text-green-500">GitHub OAuth</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-400">Server</span>
                        <span className="text-green-500">Express.js</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
