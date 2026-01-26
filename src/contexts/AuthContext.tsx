import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    email: string | null;
    avatarUrl: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            setUser(data.user || null);
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = () => {
        // Redirect to GitHub OAuth on Express server
        // Direct to port 3000 because window.location.href bypasses Vite proxy
        window.location.href = 'http://localhost:3000/api/auth/github';
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/me', { method: 'DELETE' });
            setUser(null);
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
