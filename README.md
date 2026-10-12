# Connect Arena

Real-time multiplayer Connect Four built on the MERN stack (MongoDB, Express, React, Node) with Socket.IO.

## Run it

Requirements: Node 18+, MongoDB running locally (or an Atlas URI).

```bash
npm run install:all
cp server/.env.example server/.env     # set JWT_SECRET and MONGO_URI
npm run dev:server                     # http://localhost:5000
npm run dev:client                     # http://localhost:5173
npm test                               # game engine + room tests
```

Open two browsers (or one normal + one private window), register two users, create a room in one and join from the other.

## Structure

```
server/src
  config/        env + MongoDB connection
  models/        User, Match (Mongoose)
  controllers/   auth + stats (REST)
  routes/        route table, rate limiting
  middleware/    JWT cookie auth, error handling
  services/      avatarService (3rd-party API), matchService (Elo + persistence)
  game/          connectFour.js (pure rules), roomManager.js (room state)
  sockets/       Socket.IO auth middleware + event handlers
server/tests     node:test unit tests
client/src
  api/ context/ components/ pages/ styles/
```

## Where the four assignment themes live

- **Version control**: modules are split by responsibility (rules engine, room state, transport, persistence), so each can change in its own small commit/branch. Suggested workflow: `main` + feature branches (`feature/auth`, `feature/sockets`, `feature/ui`), small commits, tag releases.
- **Event-driven programming**: `server/src/sockets/gameHandlers.js` (`room:create`, `room:join`, `game:move`, `game:rematch`, `chat:message`, `disconnect` and server broadcasts `game:state`, `game:over`, `lobby:rooms`). Client listeners are in `client/src/pages/Game.jsx` and `context/SocketContext.jsx`.
- **Interoperability**: `server/src/services/avatarService.js` calls the third-party DiceBear REST API over HTTPS and falls back to a local SVG. Client and server interoperate via REST (JSON) and WebSockets.
- **Virtual identity**: `server/src/controllers/authController.js` (bcrypt password hashing) and `middleware/auth.js` (JWT in an httpOnly, sameSite cookie). The same cookie authenticates the socket handshake in `sockets/index.js`.

## Referencing (required by the brief)

Parts of this code were generated with an LLM (Claude, Anthropic). Mark which files/sections are yours versus LLM-generated in the source comments before you submit, and note any other external code. The video must be recorded in your own voice.
