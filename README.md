# Task Management API

This final project implements a REST API for authentication, projects, tasks, and labels using Node.js, Express, PostgreSQL, Prisma, JWT authentication, ownership/role-based authorization, and Swagger UI.

## Setup
1. Set `DATABASE_URL`, `JWT_SECRET`, and optionally `PORT`.
2. Install dependencies with `npm install`.
3. Generate the Prisma client with `npm run db:generate`.
4. Push the schema with `npm run db:push`.
5. Seed sample data with `npm run db:seed`.
6. Start the API with `npm run dev`.

Swagger UI is available at `/api-docs`.

Health checks are available at `/health`.

Protected routes require a Bearer token from `/api/auth/login`.

Registered user data is available at `/api/auth/users/count`, including `total_users` and a `users` array.

## Seeded Accounts

- `admin@example.com` / `Password123!`
- `owner@example.com` / `Password123!`
- `not-owner@example.com` / `Password123!`

The project expands the design document baseline into full CRUD for `projects`, `tasks`, and `labels`.
