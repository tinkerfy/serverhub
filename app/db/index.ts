import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgress',
  database: 'serverhub',
  port: 5432,
});

export const db = drizzle(pool, { schema });
