
import { getDb, profile } from '../src/lib/db';
import { eq } from 'drizzle-orm';

async function update() {
    const db = getDb();
    await db.update(profile)
        .set({
            bio: 'A passionate Fullstack & Frontend Developer',
            specialization: 'A passionate Fullstack & Frontend Developer'
        })
        .where(eq(profile.id, 'main'));
    console.log('Profile updated successfully');
}

update();
