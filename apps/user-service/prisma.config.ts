import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load .env from user-service root
config({ path: './.env' });

export default defineConfig({
  schema: 'src/modules/user/infrastructure/database/prisma/schema',
  migrations: {
    path: 'src/modules/user/infrastructure/database/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
