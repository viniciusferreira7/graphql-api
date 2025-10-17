# GraphQL API

> ⚠️ **Work In Progress** - This project is currently under active development

A GraphQL API built with Fastify, Apollo Server, and Drizzle ORM for managing users and their pets.

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Web Framework:** [Fastify](https://fastify.dev/)
- **GraphQL Server:** [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Database:** PostgreSQL 17.2
- **Build Tool:** [tsup](https://tsup.egoist.dev/)
- **Package Manager:** pnpm 10.17.1
- **Code Quality:** [Biome](https://biomejs.dev/)

## Features

- GraphQL API with type-safe schema generated from Drizzle ORM
- Database schema for Users and Pets with relationships
- Docker Compose setup for PostgreSQL
- Database migrations with Drizzle Kit
- Seed data generation with Faker.js
- Hot reload in development mode
- Production-ready build configuration

## Database Schema

### Users
- `id` (UUID, Primary Key)
- `name` (Text)
- `email` (Text, Unique)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Pets
- `id` (UUID, Primary Key)
- `name` (Text)
- `type` (Text)
- `breed` (Text, Optional)
- `owner_id` (UUID, Foreign Key → Users)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm 10.17.1
- Docker and Docker Compose

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database_name
```

## Usage

### Development

Start the PostgreSQL database and run the development server:

```bash
pnpm start:dev
```

This will:
1. Start Docker Compose (PostgreSQL container)
2. Start the development server with hot reload

Or run commands separately:

```bash
# Start Docker containers
pnpm docker:up

# Run development server
pnpm start:dev

# View Docker logs
pnpm docker:logs

# Stop Docker containers
pnpm docker:down
```

### Database Commands

```bash
# Generate migrations from schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema changes directly to database
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Seed database with fake data
pnpm db:seed
```

### Production

Build and run the production server:

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

## GraphQL Playground

Once the server is running, access the GraphQL playground at:

```
http://localhost:3000/graphql
```

## Project Structure

```
.
├── src/
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts      # Schema exports
│   │   │   ├── users.ts      # Users table schema
│   │   │   └── pets.ts       # Pets table schema
│   │   ├── migrations/       # Database migrations
│   │   ├── client.ts         # Drizzle client configuration
│   │   └── seed.ts           # Database seeding script
│   ├── app.ts                # Fastify app configuration
│   ├── env.ts                # Environment variables
│   └── server.ts             # Server entry point
├── docker-compose.yaml       # Docker services configuration
├── drizzle.config.ts         # Drizzle Kit configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm start:dev` | Start development server with hot reload |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm db:generate` | Generate database migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema changes to database |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed database with fake data |
| `pnpm docker:up` | Start Docker containers |
| `pnpm docker:down` | Stop Docker containers |
| `pnpm docker:logs` | View Docker container logs |

## Docker Configuration

The project uses Docker Compose to run PostgreSQL 17.2:

- **Port:** 5432
- **Health checks:** Enabled with automatic retries
- **Persistent storage:** Volume mounted for data persistence
- **Network:** Isolated bridge network

## Development Notes

- The GraphQL schema is automatically generated from Drizzle ORM schema definitions
- Database uses snake_case naming convention
- Foreign key constraints with cascade delete are configured
- All timestamps are automatically managed

## License

ISC
