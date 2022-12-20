import pgk from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pgk;

export const connectionDB = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
