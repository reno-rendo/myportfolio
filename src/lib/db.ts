import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ======================
// DATABASE SCHEMAS
// ======================

// Admin Users (Manual Login)
export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

// Sessions for auth
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => adminUsers.id),
  expiresAt: text('expires_at').notNull(),
});

// Projects
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  techStack: text('tech_stack', { mode: 'json' }).$type<string[]>(),
  imageUrl: text('image_url'),
  repoUrl: text('repo_url'),
  liveUrl: text('live_url'),
  category: text('category'),
  sortOrder: integer('sort_order').default(0),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

// Experience (education + work)
export const experience = sqliteTable('experience', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text('type').notNull(), // 'education' | 'work'
  year: text('year').notNull(),
  title: text('title').notNull(),
  institute: text('institute').notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
});

// Publications
export const publications = sqliteTable('publications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  conference: text('conference').notNull(),
  url: text('url'),
  doi: text('doi'),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
});

// Certifications
export const certifications = sqliteTable('certifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  awardedBy: text('awarded_by').notNull(),
  credentials: text('credentials'),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
});

// Profile Settings
export const profile = sqliteTable('profile', {
  id: text('id').primaryKey().default('main'),
  name: text('name'),
  bio: text('bio'),
  email: text('email'),
  linkedin: text('linkedin'),
  github: text('github'),
  avatarUrl: text('avatar_url'),
  specialization: text('specialization'),
  location: text('location'),
  about: text('about'),
  resumeUrl: text('resume_url'),
});

// Tools/Skills
export const tools = sqliteTable('tools', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  label: text('label').notNull(),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').default(0),
});

// Services
export const services = sqliteTable('services', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  projectCount: text('project_count'),
  iconName: text('icon_name'),
  sortOrder: integer('sort_order').default(0),
});

// File Registry (SSOT for all files)
export const fileRegistry = sqliteTable('file_registry', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  filename: text('filename').notNull().unique(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  checksum: text('checksum').notNull(),
  path: text('path').notNull(),
  status: text('status').notNull().default('ACTIVE'), // PENDING, ACTIVE, ORPHANED
  referenceCount: integer('reference_count').notNull().default(0),
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  lastVerified: text('last_verified').$defaultFn(() => new Date().toISOString()),
});

// Stats
export const stats = sqliteTable('stats', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: text('number').notNull(),
  label: text('label').notNull(),
  sortOrder: integer('sort_order').default(0),
});

// ======================
// ALL SCHEMAS EXPORT
// ======================
export const schema = {
  adminUsers,
  sessions,
  projects,
  experience,
  publications,
  certifications,
  profile,
  tools,
  services,
  stats,
  fileRegistry,
};

// ======================
// TYPE EXPORTS
// ======================
export type AdminUser = typeof adminUsers.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Experience = typeof experience.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type Tool = typeof tools.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Stat = typeof stats.$inferSelect;
export type FileRegistry = typeof fileRegistry.$inferSelect;

// ======================
// DATABASE CONNECTION (Local SQLite)
// ======================
let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (db) return db;

  // Database file path - stored in project root
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const dbPath = join(__dirname, '..', '..', 'sqlite.db');

  const sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });
  return db;
}
