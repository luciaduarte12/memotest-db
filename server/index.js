import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getPool, sql } from "./db.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
// GET /api/tecnologias
// Trae las tecnologias que se usan como cartas del memotest.
app.get("/api/tecnologias", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT id, nombre, logo_url FROM Tecnologias");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las tecnologias" });
  }
});

// POST /api/partidas
// Guarda el resultado de una partida terminada.
// Body esperado: { tiempoSegundos: number, intentos: number }
app.post("/api/partidas", async (req, res) => {
  const { tiempoSegundos, intentos } = req.body;

  if (typeof tiempoSegundos !== "number" || typeof intentos !== "number") {
    return res.status(400).json({ error: "tiempoSegundos e intentos son requeridos y deben ser numericos" });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("tiempoSegundos", sql.Int, tiempoSegundos)
      .input("intentos", sql.Int, intentos)
      .query(
        "INSERT INTO Partidas (tiempo_segundos, intentos, fecha) OUTPUT INSERTED.id VALUES (@tiempoSegundos, @intentos, GETDATE())"
      );

    const idPartida = result.recordset[0].id;
    res.status(201).json({ mensaje: "Partida guardada", id: idPartida });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar la partida" });
  }
});

// GET /api/leaderboard
// Devuelve el top 10 de mejores partidas (menor tiempo, y a igualdad, menos intentos)
app.get("/api/leaderboard", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query("SELECT TOP 5 id, tiempo_segundos, intentos, fecha FROM Partidas ORDER BY tiempo_segundos ASC, intentos ASC");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el leaderboard" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});