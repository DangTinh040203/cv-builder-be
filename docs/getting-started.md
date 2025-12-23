# Getting Started

This guide will help you set up the CV Builder backend for local development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** ([Installation](https://pnpm.io/installation))
- **Docker & Docker Compose** ([Download](https://www.docker.com/))

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cv-builder/be
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration values.

### 4. Start Infrastructure Services

Start the required infrastructure services (PostgreSQL, Redis, MinIO, NATS):

```bash
pnpm run dev:setup
```

### 5. Run the Application

Start all services in development mode:

```bash
pnpm run serve:all
```

Or start a specific service:

```bash
pnpm run serve api-gateway
```

## Available Scripts

| Script               | Description                 |
| -------------------- | --------------------------- |
| `pnpm run build`     | Build a specific app        |
| `pnpm run build:all` | Build all apps              |
| `pnpm run serve`     | Start a specific app        |
| `pnpm run serve:all` | Start all apps              |
| `pnpm run lint`      | Run ESLint                  |
| `pnpm run lint:fix`  | Run ESLint with auto-fix    |
| `pnpm run dev:setup` | Start Docker infrastructure |

## Docker Services

When running `pnpm run dev:setup`, the following services are started:

| Service       | Port | Description                    |
| ------------- | ---- | ------------------------------ |
| PostgreSQL    | 5432 | Primary database               |
| Redis         | 6379 | Caching and session storage    |
| MinIO         | 9000 | Object storage (S3-compatible) |
| MinIO Console | 9001 | MinIO web interface            |
| NATS          | 4222 | Message broker                 |

## Generating New Apps/Libraries

### Create a new NestJS application:

```bash
npx nx g @nx/nest:app <app-name>
```

### Create a new library:

```bash
npx nx g @nx/node:lib <lib-name>
```

### View the project dependency graph:

```bash
npx nx graph
```

## Next Steps

- Review the [Folder Structure](folder-structure.md) to understand the project layout
- Read the [Code Conventions](code-conventions.md) before contributing
