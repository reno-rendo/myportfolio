import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log('🔍 Drizzle Config Check:');
console.log('   URL:', process.env.TURSO_DATABASE_URL?.split('://')[0] + '://...');
console.log('   Token Length:', process.env.TURSO_AUTH_TOKEN ? process.env.TURSO_AUTH_TOKEN.length : 'MISSING');

export default defineConfig({
  schema: './src/lib/db.ts',
  out: './drizzle',
  // dialect: 'sqlite', <--- Change to turso
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    // Drizzle Kit types might be outdated for Turso dialect?
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  verbose: true,
  strict: true,
});
