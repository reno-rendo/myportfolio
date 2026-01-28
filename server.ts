/**
 * Express.js API Server for local development
 * Run with: npm run server
 */

// Load environment variables FIRST
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { getDb, projects, experience, publications, certifications, adminUsers, sessions, profile, tools, services, stats, fileRegistry } from './src/lib/db.js';
import { hashPassword, verifyPassword, generateSessionId, getSessionExpiry, SESSION_COOKIE_NAME } from './src/lib/auth.js';
import { FileService } from './src/lib/FileService.js';
import { DEFAULTS } from './src/lib/defaults.js';
import fs from 'fs';
import { eq } from 'drizzle-orm';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3000;
const APP_URL = (process.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');

// Ensure public/uploads exists
const uploadDir = './public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// File upload configuration
// File upload configuration - STAGING AREA
const stagingDir = './public/staging';
if (!fs.existsSync(stagingDir)) {
    fs.mkdirSync(stagingDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: stagingDir,
    filename: (req, file, cb) => {
        const uniqueName = `staging-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp|svg/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) {
            cb(null, true);
        } else {
            cb(new Error('Only images allowed'));
        }
    }
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
// Serve uploaded files
app.use('/uploads', express.static('./public/uploads'));

// Helper: Get current user from session
async function getUser(req: express.Request) {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (!sessionId) return null;

    try {
        const db = getDb();
        const result = await db
            .select()
            .from(sessions)
            .innerJoin(adminUsers, eq(sessions.userId, adminUsers.id))
            .where(eq(sessions.id, sessionId))
            .limit(1);

        if (result.length === 0) return null;
        if (new Date(result[0].sessions.expiresAt) < new Date()) return null;
        return result[0].admin_users;
    } catch {
        return null;
    }
}

// Auth middleware
async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    (req as any).user = user;
    next();
}

// ==================== FILE UPLOAD ====================

// POST /api/upload - Production-grade atomic upload
app.post('/api/upload', requireAuth, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const fileRecord = await FileService.registerFile(
            req.file.path,
            req.file.originalname,
            req.file.mimetype
        );

        res.json({
            id: fileRecord.id,
            url: fileRecord.path,
            filename: fileRecord.filename,
            isNew: fileRecord.referenceCount === 1
        });
    } catch (error) {
        console.error('Upload system failure:', error);
        res.status(500).json({ error: 'Storage system error' });
    }
});

// ==================== AUTH ROUTES ====================

// POST /api/auth/login - Manual login with username/password
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    try {
        const db = getDb();
        const user = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1).then(r => r[0]);

        if (!user) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Create session
        const sessionId = generateSessionId();
        await db.insert(sessions).values({ id: sessionId, userId: user.id, expiresAt: getSessionExpiry() });

        res.cookie(SESSION_COOKIE_NAME, sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({
            success: true,
            user: { id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl }
        });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me - Get current user
app.get('/api/auth/me', async (req, res) => {
    const user = await getUser(req);
    res.json({ user: user ? { id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl } : null });
});

// PUT /api/auth/password - Change password
app.put('/api/auth/password', requireAuth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Password lama dan baru wajib diisi' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password baru minimal 6 karakter' });
    }

    try {
        const db = getDb();

        // Get current user with password hash
        const currentUser = await db.select().from(adminUsers).where(eq(adminUsers.id, user.id)).limit(1).then(r => r[0]);

        if (!currentUser) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        // Verify current password
        const isValid = await verifyPassword(currentPassword, currentUser.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Password lama salah' });
        }

        // Hash new password and update
        const newHash = await hashPassword(newPassword);
        await db.update(adminUsers).set({ passwordHash: newHash }).where(eq(adminUsers.id, user.id));

        res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (e) {
        console.error('Password change error:', e);
        res.status(500).json({ error: 'Gagal mengubah password' });
    }
});

// DELETE /api/auth/me - Logout
app.delete('/api/auth/me', async (req, res) => {
    const sessionId = req.cookies?.[SESSION_COOKIE_NAME];
    if (sessionId) {
        const db = getDb();
        await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
    res.clearCookie(SESSION_COOKIE_NAME);
    res.json({ success: true });
});

// ==================== PROJECTS ====================

app.get('/api/projects', async (req, res) => {
    try {
        const db = getDb();
        const all = await db.select().from(projects);
        res.json(all);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/projects', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.insert(projects).values(req.body).returning();
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
    try {
        const db = getDb();

        // 1. Get old project data
        const oldProject = await db.select().from(projects).where(eq(projects.id, req.params.id)).limit(1).then(r => r[0]);

        if (oldProject && oldProject.imageUrl && req.body.imageUrl && oldProject.imageUrl !== req.body.imageUrl) {
            // 2. Deregister old file reference
            await FileService.deregisterByPath(oldProject.imageUrl);
        }

        const [item] = await db.update(projects).set(req.body).where(eq(projects.id, req.params.id)).returning();
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        // 1. Get current project to check for image
        const project = await db.select().from(projects).where(eq(projects.id, req.params.id)).limit(1).then(r => r[0]);

        if (project && project.imageUrl) {
            // 2. Deregister file reference
            await FileService.deregisterByPath(project.imageUrl);
        }

        await db.delete(projects).where(eq(projects.id, req.params.id));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ==================== EXPERIENCE ====================

app.get('/api/experience', async (req, res) => {
    try {
        const db = getDb();
        const all = await db.select().from(experience);
        res.json(all);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/experience', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.insert(experience).values(req.body).returning();
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

app.put('/api/experience', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.update(experience).set(req.body).where(eq(experience.id, req.query.id as string)).returning();
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/experience', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        await db.delete(experience).where(eq(experience.id, req.query.id as string));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ==================== PUBLICATIONS ====================

app.get('/api/publications', async (req, res) => {
    try {
        const db = getDb();
        const all = await db.select().from(publications);
        res.json(all);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/publications', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.insert(publications).values(req.body).returning();
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

app.put('/api/publications', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.update(publications).set(req.body).where(eq(publications.id, req.query.id as string)).returning();
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/publications', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        await db.delete(publications).where(eq(publications.id, req.query.id as string));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ==================== CERTIFICATIONS ====================

app.get('/api/certifications', async (req, res) => {
    try {
        const db = getDb();
        const all = await db.select().from(certifications);
        res.json(all);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/certifications', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.insert(certifications).values(req.body).returning();
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

app.put('/api/certifications', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.update(certifications).set(req.body).where(eq(certifications.id, req.query.id as string)).returning();
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/certifications', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        await db.delete(certifications).where(eq(certifications.id, req.query.id as string));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ==================== PROFILE ====================

// GET /api/profile - Get profile (public)
app.get('/api/profile', async (req, res) => {
    try {
        const db = getDb();
        const result = await db.select().from(profile).where(eq(profile.id, 'main')).limit(1);
        res.json(result[0] || null);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// PUT /api/profile - Update profile (protected)
app.put('/api/profile', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        // Try to update existing
        const existing = await db.select().from(profile).where(eq(profile.id, 'main')).limit(1);

        if (existing.length > 0) {
            const [item] = await db.update(profile).set(req.body).where(eq(profile.id, 'main')).returning();
            res.json(item);
        } else {
            // Create if doesn't exist
            const [item] = await db.insert(profile).values({ id: 'main', ...req.body }).returning();
            res.json(item);
        }
    } catch (e) {
        console.error('Profile update error:', e);
        res.status(500).json({ error: 'Failed to update' });
    }
});

// ==================== TOOLS ====================

app.get('/api/tools', async (req, res) => {
    try {
        const db = getDb();
        const all = await db.select().from(tools);
        res.json(all);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/tools', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.insert(tools).values(req.body).returning();
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

app.put('/api/tools', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.update(tools).set(req.body).where(eq(tools.id, req.query.id as string)).returning();
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/tools', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        await db.delete(tools).where(eq(tools.id, req.query.id as string));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ==================== SERVICES ====================

app.get('/api/services', async (req, res) => {
    try {
        const db = getDb();
        const all = await db.select().from(services);
        res.json(all);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/services', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.insert(services).values(req.body).returning();
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

app.put('/api/services', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.update(services).set(req.body).where(eq(services.id, req.query.id as string)).returning();
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/services', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        await db.delete(services).where(eq(services.id, req.query.id as string));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// ==================== STATS ====================

app.get('/api/stats', async (req, res) => {
    try {
        const db = getDb();
        const all = await db.select().from(stats);
        res.json(all);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

app.post('/api/stats', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.insert(stats).values(req.body).returning();
        res.status(201).json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create' });
    }
});

app.put('/api/stats', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        const [item] = await db.update(stats).set(req.body).where(eq(stats.id, req.query.id as string)).returning();
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update' });
    }
});

app.delete('/api/stats', requireAuth, async (req, res) => {
    try {
        const db = getDb();
        await db.delete(stats).where(eq(stats.id, req.query.id as string));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

// Function to seed default data
const seedDefaults = async () => {
    try {
        const db = getDb();

        // Seed Admin
        const adminCount = await db.select({ count: adminUsers.id }).from(adminUsers);
        if (adminCount.length === 0) {
            console.log('🌱 Seeding default admin...');
            const hash = await hashPassword('admin123');
            await db.insert(adminUsers).values({
                username: 'admin',
                passwordHash: hash,
                role: 'admin'
            });
            console.log('✅ Admin seeded!');
        }

        // Seed Profile
        const existing = await db.select().from(profile).where(eq(profile.id, 'main')).limit(1);
        if (existing.length === 0) {
            console.log('🌱 Seeding default profile...');
            await db.insert(profile).values(DEFAULTS.profile);
            console.log('✅ Profile seeded!');
        }
    } catch (e) {
        console.error('Failed to auto-seed:', e);
    }
};

// Scheduled tasks wrapper
const startScheduledTasks = () => {
    // Run Garbage Collector every 24 hours
    setInterval(async () => {
        try {
            await FileService.collectGarbage(24);
        } catch (e) {
            console.error('[CRON] Garbage collection failed:', e);
        }
    }, 24 * 60 * 60 * 1000);

    // Initial check on startup (with short grace period for safety)
    setTimeout(() => FileService.collectGarbage(1), 5000);
};

// Start server if not in Vercel/Serverless environment
// Vercel usually sets process.env.VERCEL or we can check if file is being run directly
const isVercel = process.env.VERCEL === '1';

if (!isVercel) {
    app.listen(PORT, async () => {
        console.log(`\n🚀 API Server running at http://localhost:${PORT}`);
        console.log(`   Frontend: http://localhost:5173`);
        console.log(`   Admin:    http://localhost:5173/admin\n`);

        await seedDefaults();
        startScheduledTasks();
    });
} else {
    // Vercel Environment - Fire and forget seeding
    // We cannot block the export, but we can try to seed asynchronously
    seedDefaults().catch(err => console.error('Vercel Seed Error:', err));
}

export default app;
