const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function getTecnologias() {
  const res = await fetch(`${API_URL}/tecnologias`);
  if (!res.ok) throw new Error("Error al traer las tecnologias");
  return res.json();
}

export async function guardarPartida(tiempoSegundos, intentos) {
  const res = await fetch(`${API_URL}/partidas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tiempoSegundos, intentos }),
  });
  if (!res.ok) throw new Error("Error al guardar la partida");
  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch(`${API_URL}/leaderboard`);
  if (!res.ok) throw new Error("Error al traer el leaderboard");
  return res.json();
}