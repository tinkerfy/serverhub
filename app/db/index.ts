import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: '192.168.10.44',
  user: 'postgres',
  password: 'postgres',
  database: 'serverhub',
  port: 5432,
});

export const db = drizzle(pool, { schema });
