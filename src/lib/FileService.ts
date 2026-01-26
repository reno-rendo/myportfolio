import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getDb, fileRegistry } from './db.js';
import { eq, sql } from 'drizzle-orm';

/**
 * PRODUCTION FILE LIFECYCLE SYSTEM
 * Database is the Single Source of Truth (SSOT).
 * Features: Atomic upload, Checksum deduplication, Reference tracking.
 */

export class FileService {
    private static UPLOAD_DIR = './public/uploads';

    /**
     * Calculate SHA-256 Checksum of a file
     */
    private static async getChecksum(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHash('sha256');
            const stream = fs.createReadStream(filePath);
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }

    /**
     * ATOMIC UPLOAD / REPLACE
     * @param tempFilePath Path to the file in staging/temp
     * @param originalName Original filename from user
     * @param mimeType Mime type
     */
    static async registerFile(tempFilePath: string, originalName: string, mimeType: string) {
        const db = getDb();
        const stats = fs.statSync(tempFilePath);
        const checksum = await this.getChecksum(tempFilePath);

        console.log(`[FILE_SYSTEM] Processing file: ${originalName}, checksum: ${checksum.substring(0, 10)}...`);

        // 1. DEDUPLICATION CHECK
        const existing = await db.select().from(fileRegistry).where(eq(fileRegistry.checksum, checksum)).limit(1);

        if (existing.length > 0) {
            console.log(`[FILE_SYSTEM] Deduplication hit: Reusing existing file ID ${existing[0].id}`);
            // Reuse existing file
            await db.update(fileRegistry)
                .set({ referenceCount: sql`${fileRegistry.referenceCount} + 1`, status: 'ACTIVE' })
                .where(eq(fileRegistry.id, existing[0].id));

            // Delete temp file since we don't need it
            fs.unlinkSync(tempFilePath);
            return existing[0];
        }

        // 2. NEW FILE REGISTRATION
        const fileId = crypto.randomUUID();
        const ext = path.extname(originalName);
        const newFilename = `${fileId}${ext}`;
        const finalPath = path.join(this.UPLOAD_DIR, newFilename);

        try {
            // Move file to final destination (ATOMIC in same volume)
            fs.renameSync(tempFilePath, finalPath);

            const [newFile] = await db.insert(fileRegistry).values({
                id: fileId,
                filename: newFilename,
                originalName: originalName,
                mimeType: mimeType,
                size: stats.size,
                checksum: checksum,
                path: `/uploads/${newFilename}`,
                status: 'ACTIVE',
                referenceCount: 1
            }).returning();

            console.log(`[FILE_SYSTEM] New file registered: ${fileId}`);
            return newFile;
        } catch (error) {
            console.error(`[FILE_SYSTEM] Fail-safe error: Rolling back upload for ${originalName}`, error);
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
            throw error;
        }
    }

    /**
     * DEREGISTER FILE (Decrement Reference)
     * Does not delete physically, only marks as ORPHANED if count is 0.
     */
    static async deregisterFile(fileId: string) {
        const db = getDb();
        console.log(`[FILE_SYSTEM] Deregistering reference for file: ${fileId}`);

        const file = await db.select().from(fileRegistry).where(eq(fileRegistry.id, fileId)).limit(1);
        if (file.length === 0) return;

        const newCount = Math.max(0, file[0].referenceCount - 1);
        const status = newCount === 0 ? 'ORPHANED' : 'ACTIVE';

        await db.update(fileRegistry)
            .set({ referenceCount: newCount, status: status })
            .where(eq(fileRegistry.id, fileId));
    }

    /**
     * DEREGISTER BY PATH/URL
     * Useful for cleaning up when a record is deleted or updated.
     */
    static async deregisterByPath(filePath: string) {
        if (!filePath) return;
        const db = getDb();
        const file = await db.select().from(fileRegistry).where(eq(fileRegistry.path, filePath)).limit(1);
        if (file.length > 0) {
            await this.deregisterFile(file[0].id);
        }
    }

    /**
     * GARBAGE COLLECTOR
     * Physical deletion of ORPHANED files.
     */
    static async collectGarbage(gracePeriodHours = 24) {
        const db = getDb();
        const orphanDate = new Date(Date.now() - gracePeriodHours * 3600000).toISOString();

        console.log(`[GARBAGE_COLLECTOR] Starting cleanup for orphans older than ${orphanDate}...`);

        const orphans = await db.select()
            .from(fileRegistry)
            .where(sql`${fileRegistry.status} = 'ORPHANED' AND ${fileRegistry.createdAt} < ${orphanDate}`);

        let deletedCount = 0;
        let freedSpace = 0;

        for (const orphan of orphans) {
            const fullPath = path.join('./public', orphan.path);
            try {
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
                await db.delete(fileRegistry).where(eq(fileRegistry.id, orphan.id));
                deletedCount++;
                freedSpace += orphan.size;
                console.log(`[GARBAGE_COLLECTOR] Deleted orphan: ${orphan.filename}`);
            } catch (error) {
                console.error(`[GARBAGE_COLLECTOR] Failed to delete ${orphan.filename}`, error);
            }
        }

        console.log(`[GARBAGE_COLLECTOR] Cleanup finished. Deleted: ${deletedCount}, Freed: ${(freedSpace / 1024 / 1024).toFixed(2)} MB`);
        return { deletedCount, freedSpace };
    }
}
