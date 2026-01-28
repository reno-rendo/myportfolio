
import 'dotenv/config';
import { createClient } from '@libsql/client';

async function check() {
    console.log('🔍 Checking Turso Configuration...');

    const url = process.env.TURSO_DATABASE_URL;
    const token = process.env.TURSO_AUTH_TOKEN;

    console.log(`\n1. Environment Variables:`);
    console.log(`   - TURSO_DATABASE_URL: ${url ? '✅ Found (' + url.split('://')[0] + '://...)' : '❌ MISSING'}`);
    console.log(`   - TURSO_AUTH_TOKEN:   ${token ? `✅ Found (Length: ${token.length})` : '❌ MISSING'}`);

    if (!url || !token) {
        console.error('\n❌ ERROR: URL or Token is missing in .env');
        process.exit(1);
    }

    console.log('\n2. Testing Connection...');
    try {
        const client = createClient({ url, authToken: token });
        const result = await client.execute('SELECT 1');
        console.log('   ✅ Connection Successful!');
        console.log('   ✅ Database returned:', result);
    } catch (e) {
        console.error('   ❌ Connection Failed!');
        console.error('   Error Message:', e.message);
        console.error('   Status:', e.status || 'Unknown');
    }
}

check();
