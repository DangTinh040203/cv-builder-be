import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load .env from user-service root
config({ path: './.env' });

export default defineConfig({
  schema: 'src/common/database/prisma/schema',
  migrations: {
    path: 'src/common/database/prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
