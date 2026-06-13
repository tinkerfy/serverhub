import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/db/schema.ts',
  out: './app/db/migrations',
  dbCredentials: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgress',
    database: 'serverhub',
    port: 5432,
    ssl: { rejectUnauthorized: false },
  },
});
