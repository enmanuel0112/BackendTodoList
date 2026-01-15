# Backend Todo List API

Simple REST API for managing personal tasks with authenticated users. Built with Express 5, TypeScript, TypeORM, and PostgreSQL, using JWT stored in an `httpOnly` cookie for session management.

## Stack
- Node.js, Express 5, TypeScript
- TypeORM + PostgreSQL (schema sync enabled)
- JWT auth with `httpOnly` cookies, bcrypt password hashing
- Zod request validation, CORS, morgan logging, cookie-parser

## Getting Started
1. Install Node.js 18+ and PostgreSQL.
2. Install dependencies: `npm install`.
3. Create a `.env` file (see sample below) — easiest is `cp .env.example .env` and then adjust values.
4. Start the API: `npm run dev` (listens on `http://localhost:4000`).

## Environment Variables
Create `.env` in the project root (you can copy `.env.example`):
```
# Database
TYPE=postgres
HOST=localhost
PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Auth
JWT_ACCESS_SECRET=replace-me
JWT_REFRESH_ACCESS_SECRET=replace-me-too

# Optional
NODE_ENV=development
```

## Available Scripts
- `npm run dev` - start in watch mode with `ts-node-dev`.
- `npm run build` - compile TypeScript to `dist/`.
- `npm start` - run the compiled app from `dist/index.js`.

## API Overview
Base URL: `http://localhost:4000/api`  
Auth: JWT issued on login and stored as an `httpOnly` cookie named `jwt`. Send requests with credentials (for example, `fetch(..., { credentials: "include" })`).

### Users & Auth (`/api/user`)
- `POST /register` - body `{ userName, email, password }`; password min 8 chars with uppercase and special character. Returns created user (password omitted).
- `POST /login` - body `{ email, password }`; issues JWT cookie and returns user info.
- `GET /profile` - requires cookie; returns the current user.
- `PUT /` - requires cookie; update `userName` and/or `email`.
- `POST /logout` - clears the auth cookie.
- `DELETE /` - deletes the authenticated user.

### Tasks (`/api/task`)
- `POST /` - requires cookie; body `{ content, isCompleted? }`; `content` min 10 chars. Creates a task.
- `GET /` - requires cookie; query `page` (default 1) and `limit` (default 10). Returns paginated tasks for the user.
- `PUT /:taskId` - requires cookie; body `{ content?, isCompleted? }`; updates a task owned by the user.
- `DELETE /:taskId` - requires cookie; deletes a task by id.

## Data Model
- **User**: `id`, `userName`, `email` (unique), `password` (hashed), `createdAt`, `updatedAt`, `tasks`.
- **Task**: `taskId`, `content`, `isCompleted`, `createdAt`, `updatedAt`, `user` (owner, cascade delete).

## Notes
- CORS allows `http://localhost:5173` with credentials.
- Token settings: access TTL `1d`, refresh TTL `30d` (see `src/config/jwt.ts`).
- TypeORM runs with `synchronize: true`; disable this in production in favor of migrations.
