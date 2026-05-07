# AGENTS.md

## Dev Commands
```bash
npm run dev   # nodemon - restart automático
npm start     # node index.js
```

## API
- Puerto: 4500
- Rutas activas: `/newOffer`, `/search`
- Rutas commented-out: `/products`, `/cronDaily` (descomentar en index.js si se necesitan)

## DB
- PostgreSQL via `pg` driver (no ORM)
- Config en `.env`: `DATABASE_URL`
- Pool exportado en `db.js`

## Setup
```bash
# Crear .env con DATABASE_URL si no existe
npm install
npm run dev
```

## Prisma (opcional)
Si se quiere migrar a Prisma:
```bash
npm install prisma @prisma/client --save
npx prisma init --datasource-provider postgresql
npx prisma migrate dev --name init
npx prisma generate
```