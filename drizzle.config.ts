import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './sqlite.db',
  },
  verbose: true,
  strict: true,
});
