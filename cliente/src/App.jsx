import { useEffect, useState } from "react";
import { getTecnologias, guardarPartida, getLeaderboard } from "./services/api";
import "./App.css";

function App() {
  const [cartas, setCartas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [volteadas, setVolteadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [intentos, setIntentos] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [partidaGuardada, setPartidaGuardada] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [idPartidaActual, setIdPartidaActual] = useState(null);

  useEffect(() => {
    async function cargarJuego() {
      const tecnologias = await getTecnologias();

      const cartasDuplicadas = tecnologias.flatMap((tec) => [
        { ...tec, cartaId: `${tec.id}-a` },
        { ...tec, cartaId: `${tec.id}-b` },
      ]);

      const cartasMezcladas = cartasDuplicadas.sort(() => Math.random() - 0.5);

      setCartas(cartasMezcladas);
      setCargando(false);
    }

    cargarJuego();
  }, []);

  const juegoTerminado = cartas.length > 0 && encontradas.length === cartas.length;

  // Revisa si hay un par, o si hay que tapar de nuevo
  useEffect(() => {
    if (volteadas.length !== 2) return;

    setIntentos((prev) => prev + 1);

    const [idA, idB] = volteadas;
    const cartaA = cartas.find((c) => c.cartaId === idA);
    const cartaB = cartas.find((c) => c.cartaId === idB);

    if (cartaA.id === cartaB.id) {
      setEncontradas((prev) => [...prev, idA, idB]);
      setVolteadas([]);
    } else {
      const timer = setTimeout(() => {
        setVolteadas([]);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [volteadas, cartas]);

  // Segundero: corre mientras el juego este cargado y no haya terminado
  useEffect(() => {
    if (cargando || juegoTerminado) return;

    const interval = setInterval(() => {
      setTiempo((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [cargando, juegoTerminado]);

  // Guarda la partida en el backend una sola vez, al ganar, y trae el leaderboard actualizado
  useEffect(() => {
    if (!juegoTerminado || partidaGuardada) return;

    async function guardarYActualizarRanking() {
      const resultado = await guardarPartida(tiempo, intentos);
      setIdPartidaActual(resultado.id);
      setPartidaGuardada(true);

      const top10 = await getLeaderboard();
      setLeaderboard(top10);
    }

    guardarYActualizarRanking();
  }, [juegoTerminado, partidaGuardada, tiempo, intentos]);

  function manejarClickCarta(cartaId) {
    if (volteadas.length === 2) return;
    if (volteadas.includes(cartaId) || encontradas.includes(cartaId)) return;

    setVolteadas((prev) => [...prev, cartaId]);
  }

  function jugarDeNuevo() {
    // Sacamos las tecnologias unicas a partir de las cartas actuales, y volvemos a mezclar
    const tecnologiasUnicas = [];
    const idsVistos = new Set();
    for (const carta of cartas) {
      if (!idsVistos.has(carta.id)) {
        idsVistos.add(carta.id);
        tecnologiasUnicas.push(carta);
      }
    }

    const cartasDuplicadas = tecnologiasUnicas.flatMap((tec) => [
      { ...tec, cartaId: `${tec.id}-a` },
      { ...tec, cartaId: `${tec.id}-b` },
    ]);
    const cartasMezcladas = cartasDuplicadas.sort(() => Math.random() - 0.5);

    setCartas(cartasMezcladas);
    setVolteadas([]);
    setEncontradas([]);
    setIntentos(0);
    setTiempo(0);
    setPartidaGuardada(false);
    setLeaderboard([]);
    setIdPartidaActual(null);
  }

  if (cargando) {
    return <div className="app">Cargando...</div>;
  }

  return (
    <div className="app">
      <h1>MEMOTEST</h1>
      <p className="marcador">Tiempo: {tiempo}s | Intentos: {intentos}</p>

      {juegoTerminado && (
        <>
          <p className="victoria">¡Ganaste! Completaste el memotest.</p>
          {leaderboard.length > 0 && (
            <div className="leaderboard">
              <h2>Mejores tiempos</h2>
              <ol>
                {leaderboard.map((partida) => (
                  <li
                    key={partida.id}
                    className={partida.id === idPartidaActual ? "mi-partida" : ""}
                  >
                    {partida.tiempo_segundos}s — {partida.intentos} intentos
                  </li>
                ))}
              </ol>
            </div>
          )}
          <button className="boton-reiniciar" onClick={jugarDeNuevo}>
            Jugar de nuevo
          </button>
        </>
      )}

      <div className="tablero">
        {cartas.map((carta) => {
          const esEncontrada = encontradas.includes(carta.cartaId);
          const estaVolteada = volteadas.includes(carta.cartaId) || esEncontrada;
          return (
            <div
              key={carta.cartaId}
              className={`carta ${estaVolteada ? "volteada" : ""} ${esEncontrada ? "encontrada" : ""}`}
              onClick={() => manejarClickCarta(carta.cartaId)}
            >
              <div className="carta-interior">
                <div className="carta-reverso"></div>
                <div className="carta-frente">{carta.nombre}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;