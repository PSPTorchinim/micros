/* eslint-disable no-undef */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
} else {
  console.warn('⚠️  .env file not found at', envPath);
  require('dotenv').config();
}

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

const outputPath = path.join(
  __dirname,
  '..',
  'src',
  'models',
  'strapi',
  'api.ts',
);

execSync(
  `npx swagger-typescript-api generate -p "${STRAPI_URL}/swagger-spec.json" -o ${outputPath} -n apiMap.ts --module-name-first-tag --extract-enums --axios --disableStrictSSL`,
  {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  },
);
