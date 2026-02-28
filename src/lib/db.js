import { Pool } from 'pg';

let conn;

if (!conn) {
  conn = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export const pool = conn;