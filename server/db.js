import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

// Configuracion de conexion a SQL Server usando las variables de .env
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Pool de conexiones: se reutiliza en toda la app en vez de abrir
// una conexion nueva por cada request
let pool;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
    console.log("Conectado a SQL Server");
  }
  return pool;
}

export { sql };