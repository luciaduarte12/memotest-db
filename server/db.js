import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Configuracion de conexion a PostgreSQL usando las variables de .env
const config = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
};

// Pool de conexiones: se reutiliza en toda la app en vez de abrir
// una conexion nueva por cada request
const pool = new Pool(config);

export async function getPool() {
  return pool;
}