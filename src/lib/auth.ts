import { GitHub } from 'arctic';

// GitHub OAuth configuration
const APP_URL = (process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173')).replace(/\/$/, '');

export const github = new GitHub(
    process.env.GITHUB_CLIENT_ID || '',
    process.env.GITHUB_CLIENT_SECRET || '',
    process.env.GITHUB_REDIRECT_URI || `${APP_URL}/api/auth/github/callback`
);

// Session cookie config
export const SESSION_COOKIE_NAME = 'portfolio_session';
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Check if user is in allowed admin list
export function isAllowedAdmin(_githubId: string, username: string): boolean {
    // Configurable via env variable - comma separated GitHub usernames
    const allowedAdmins = (process.env.ALLOWED_ADMIN_USERNAMES || 'reno-rendo').split(',');
    return allowedAdmins.includes(username.toLowerCase());
}

// Generate session ID
export function generateSessionId(): string {
    return crypto.randomUUID();
}

// Calculate session expiry
export function getSessionExpiry(): string {
    return new Date(Date.now() + SESSION_DURATION_MS).toISOString();
}
