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

### 6. Set Up ngrok for Clerk Webhooks

To receive webhooks from Clerk during local development, you need to expose your local API Gateway using `ngrok`.

1. **Install ngrok** from [ngrok.com](https://ngrok.com/download).
2. **Start the tunnel**:

   ```bash
   ngrok http 3000
   ```

   _(Assuming API Gateway runs on port 3000)_

3. **Configure Clerk**: Copy the HTTPS URL provided by ngrok and update the Webhook Endpoint in your Clerk Dashboard.

## Available Scripts

| Script                | Description                     |
| --------------------- | ------------------------------- |
| `pnpm run build`      | Build a specific app            |
| `pnpm run build:all`  | Build all apps                  |
| `pnpm run serve`      | Start a specific app            |
| `pnpm run serve:all`  | Start all apps                  |
| `pnpm run lint`       | Run ESLint                      |
| `pnpm run lint:fix`   | Run ESLint with auto-fix        |
| `pnpm run dev:setup`  | Start Docker infrastructure     |
| `pnpm run docs:serve` | Serve documentation (port 4000) |

## Docker Services

When running `pnpm run dev:setup`, the following services are started:

| Service       | Port | Description                    |
| ------------- | ---- | ------------------------------ |
| PostgreSQL    | 5432 | Primary database               |
| Redis         | 6379 | Caching and session storage    |
| MinIO         | 9000 | Object storage (S3-compatible) |
| MinIO Console | 9001 | MinIO web interface            |
| NATS          | 4222 | Message broker                 |
| Keycloak      | 8080 | Identity & Access Management   |

## Generating New Apps/Libraries

### Create a new NestJS application

```bash
npx nx g @nx/nest:app <app-name>
```

### Create a new library

```bash
npx nx g @nx/node:lib <lib-name>
```

### View the project dependency graph

```bash
npx nx graph
```

## Next Steps

- Review the [Folder Structure](folder-structure.md) to understand the project layout
- Read the [Code Conventions](code-conventions.md) before contributing
