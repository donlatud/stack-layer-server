import "dotenv/config";
import * as pg from "pg";

const { Pool } = pg.default;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
});

export default pool;