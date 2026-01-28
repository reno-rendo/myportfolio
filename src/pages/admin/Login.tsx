import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoginPage() {
    const { user, loading, login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setIsSubmitting(true);

        const result = await login(username, password);

        if (result.success) {
            navigate('/admin');
        } else {
            setLoginError(result.error || 'Login gagal');
        }

        setIsSubmitting(false);
    };

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'session_expired':
                return 'Sesi telah berakhir. Silakan login kembali.';
            default:
                return null;
        }
    };

    const urlErrorMessage = getErrorMessage(error);
    const displayError = loginError || urlErrorMessage;

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        <span className="text-green-500">⚡</span> Portfolio Admin
                    </h1>
                    <p className="text-zinc-400">Masuk untuk mengelola konten portfolio</p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
                    {/* Error message */}
                    {displayError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-red-400 text-sm">{displayError}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-zinc-400 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                    placeholder="Masukkan username"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                    placeholder="Masukkan password"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-600 hover:bg-green-500 text-white py-6 mt-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 animate-spin" size={20} />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2" size={20} />
                                    Masuk
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Back link */}
                <p className="mt-6 text-center">
                    <a href="/" className="text-zinc-500 hover:text-white text-sm transition-colors">
                        ← Kembali ke Portfolio
                    </a>
                </p>
            </div>
        </div>
    );
}
