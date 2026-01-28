import bcrypt from 'bcryptjs';

// Session cookie config
export const SESSION_COOKIE_NAME = 'portfolio_session';
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

// Password hashing
const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// Generate session ID
export function generateSessionId(): string {
    return crypto.randomUUID();
}

// Calculate session expiry
export function getSessionExpiry(): string {
    return new Date(Date.now() + SESSION_DURATION_MS).toISOString();
}
