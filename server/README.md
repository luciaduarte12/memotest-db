# Memotest DB

Memotest jugable con el stack tecnológico del portfolio (React, SQL Server, Vite, Express, Power BI, Git). Pensado para jugarse desde el portfolio en un click, sin pedir nombre ni registro.

## Estructura

```
memotest-db/
├── cliente/    React + Vite - el juego en si
├── server/     Express - API
└── database/   Script SQL Server (schema + datos iniciales)
```

## Stack

- **Frontend:** React + Vite, react-icons para los logos de las cartas
- **Backend:** Express + mssql (driver de SQL Server para Node)
- **Base de datos:** SQL Server 2025 (Developer Edition)

## Modelo de datos

**Tecnologias** — el contenido de las cartas (id, nombre, logo_url)
**Partidas** — resultado de cada partida jugada (tiempo_segundos, intentos, fecha)

No se guarda jugador: el juego es anónimo, pensado para acceder con un click desde la sección de proyectos del portfolio.

## Estado del proyecto

- [x] Base de datos creada (`MemotestDB`) con las tablas `Tecnologias` y `Partidas`
- [x] Usuario SQL (`memotest_user`) creado con permisos `db_datareader` y `db_datawriter`
- [x] Servidor Express funcionando, conectado a SQL Server
- [x] Endpoint `GET /api/tecnologias` — trae las 6 tecnologías (probado)
- [x] Endpoint `POST /api/partidas` — guarda el resultado de una partida (probado con Postman)
- [x] Endpoint `GET /api/leaderboard` — top 10 mejores partidas (probado)
- [ ] Lógica del juego en React (tablero, cartas, pares, timer)
- [ ] Diseño visual de las cartas (negro + dorado)
- [ ] Conectar el cliente con la API (`services/api.js`)
- [ ] Deploy del proyecto (cliente y servidor por separado)
- [ ] Integración con el portfolio (botón "Jugar")

## Cómo levantarlo en local

### 1. Base de datos

Requisitos: SQL Server instalado con **modo de autenticación mixto** habilitado y **TCP/IP habilitado** (Protocols for MSSQLSERVER, en SQL Server Configuration Manager).

Correr `database/schema.sql` en tu instancia de SQL Server (crea la base, las tablas, y carga las 6 tecnologías iniciales). Después, crear el usuario `memotest_user` con SQL Authentication y darle permisos `db_datareader` + `db_datawriter` sobre `MemotestDB`.

### 2. Servidor

```bash
cd server
npm install
```

Crear un archivo `.env` en `server/` con:

```
DB_SERVER=localhost
DB_DATABASE=MemotestDB
DB_USER=memotest_user
DB_PASSWORD=tu_contraseña
DB_PORT=1433

PORT=3001
CLIENT_URL=http://localhost:5173
```

Levantar el servidor:

```bash
npm run dev
```

Debería mostrar:
```
Servidor corriendo en http://localhost:3001
```

(El mensaje "Conectado a SQL Server" aparece recién en el primer request que toca la base.)

### 3. Cliente

```bash
cd cliente
npm install
npm run dev
```

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tecnologias` | Devuelve las 6 tecnologías (id, nombre, logo_url) |
| POST | `/api/partidas` | Guarda una partida. Body: `{ tiempoSegundos, intentos }` |
| GET | `/api/leaderboard` | Devuelve el top 10 de mejores partidas |

## Notas técnicas

- `logo_url` en la tabla `Tecnologias` guarda un identificador corto (ej: `react`, `vite`), no una URL completa. El frontend mapea ese identificador al ícono correspondiente de `react-icons`.
- Las consultas que reciben datos del cliente (como `POST /api/partidas`) usan parámetros (`.input(...)`) en vez de concatenar valores directo en el SQL, para evitar SQL injection.
