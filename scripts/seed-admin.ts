/**
 * Script untuk membuat admin user dengan password
 * Run: npx tsx scripts/seed-admin.ts
 */

import 'dotenv/config';
import { getDb, adminUsers } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth';
import { eq } from 'drizzle-orm';

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

async function seedAdmin() {
    console.log('🌱 Seeding admin user...\n');

    const db = getDb();

    // Check if admin already exists
    const existing = await db.select().from(adminUsers).where(eq(adminUsers.username, DEFAULT_USERNAME)).limit(1);

    if (existing.length > 0) {
        console.log('⚠️  Admin user already exists!');
        console.log(`   Username: ${DEFAULT_USERNAME}`);
        console.log('\n   To reset password, delete the user first and run this script again.');
        process.exit(0);
    }

    // Create new admin
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);

    const [newAdmin] = await db.insert(adminUsers).values({
        username: DEFAULT_USERNAME,
        passwordHash: passwordHash,
        email: 'admin@portfolio.local',
    }).returning();

    console.log('✅ Admin user created successfully!\n');
    console.log('   ┌─────────────────────────────────┐');
    console.log(`   │  Username: ${DEFAULT_USERNAME.padEnd(20)} │`);
    console.log(`   │  Password: ${DEFAULT_PASSWORD.padEnd(20)} │`);
    console.log('   └─────────────────────────────────┘');
    console.log('\n⚠️  Harap ganti password setelah login pertama!');

    process.exit(0);
}

seedAdmin().catch((error) => {
    console.error('❌ Failed to seed admin:', error);
    process.exit(1);
});
