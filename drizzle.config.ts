import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/db/schema.ts',
  out: './app/db/migrations',
  dbCredentials: {
    host: '192.168.10.44',
    user: 'postgres',
    password: 'postgres',
    database: 'serverhub',
    port: 5432,
  },
});
