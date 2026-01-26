
import { getDb, profile } from '../src/lib/db';
import { eq } from 'drizzle-orm';

async function update() {
    const db = getDb();
    await db.update(profile)
        .set({
            bio: 'A passionate Fullstack & Frontend Developer',
            specialization: 'Figma, react.js, & node.js'
        })
        .where(eq(profile.id, 'main'));
    console.log('Profile separated successfully');
}

update();
