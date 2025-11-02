# MERN E-commerce Monorepoo

This is a monorepo for a secure, testable MERN e-commerce system.

## Workspaces
- `client/` – Vite + React + TS, RTK/RTK Query
- `server/` – Express + TypeScript + MongoDB (Mongoose)

## Quick Start
1) Install deps
```bash
npm run bootstrap
```

2) Server env
```bash
cp server/.env.example server/.env
# edit values as needed
```

3) Run server
```bash
npm run dev:server
```

4) Client env
```bash
cp client/.env.example client/.env
# edit values as needed
```

5) Run client
```bash
npm run dev:client
```

## Health Check
- Server: GET /health => 200 { "message": "ok" }
