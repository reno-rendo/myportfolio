import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Github, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoginPage() {
    const { user, loading, login } = useAuth();
    const [searchParams] = useSearchParams();
    const error = searchParams.get('error');

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

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'not_authorized':
                return 'Your GitHub account is not authorized to access admin panel.';
            case 'invalid_state':
                return 'Authentication failed. Please try again.';
            case 'callback_failed':
                return 'Failed to complete authentication.';
            default:
                return null;
        }
    };

    const errorMessage = getErrorMessage(error);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        <span className="text-green-500">⚡</span> Portfolio Admin
                    </h1>
                    <p className="text-zinc-400">Sign in to manage your portfolio content</p>
                </div>

                {/* Card */}
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8">
                    {/* Error message */}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                            <p className="text-red-400 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {/* GitHub login button */}
                    <Button
                        onClick={login}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 py-6"
                    >
                        <Github className="mr-2" size={20} />
                        Continue with GitHub
                    </Button>

                    <p className="mt-6 text-center text-xs text-zinc-500">
                        Only authorized GitHub accounts can access the admin panel
                    </p>
                </div>

                {/* Back link */}
                <p className="mt-6 text-center">
                    <a href="/" className="text-zinc-500 hover:text-white text-sm transition-colors">
                        ← Back to Portfolio
                    </a>
                </p>
            </div>
        </div>
    );
}
