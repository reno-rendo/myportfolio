
import { getDb, profile } from '../src/lib/db';
import { eq } from 'drizzle-orm';

async function check() {
    const db = getDb();
    const res = await db.select().from(profile).where(eq(profile.id, 'main'));
    if (res.length > 0) {
        console.log('NAME:', res[0].name);
        console.log('BIO:', res[0].bio);
        // @ts-ignore
        console.log('SPEC:', res[0].specialization);
    } else {
        console.log('NO PROFILE FOUND');
    }
}

check();
