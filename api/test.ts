
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        message: 'Vercel Function is WORKING!',
        timestamp: new Date().toISOString(),
        env_db: process.env.TURSO_DATABASE_URL ? 'Set' : 'Missing',
    });
}
