import { config } from 'dotenv';
import { join } from 'path';
import { defineConfig } from 'prisma/config';

// Load .env from user-service root (apps/user-service/.env)
config({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
