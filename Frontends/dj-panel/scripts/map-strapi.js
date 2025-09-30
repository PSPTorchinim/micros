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

const outputPath = path.join(__dirname, '..', 'src', 'models', 'strapi');

console.log('🔄 Generating Strapi API types...');
console.log(`📡 Strapi URL: ${STRAPI_URL}`);
console.log(`📁 Output path: ${outputPath}`);

try {
  // Try the correct documentation endpoint first
  let swaggerUrl = `${STRAPI_URL}/api/swagger-spec.json`;

  console.log(`🔍 Attempting to fetch from: ${swaggerUrl}`);

  execSync(
    `npx swagger-typescript-api generate -p "${swaggerUrl}" -o ${outputPath} -n apiMap.ts --module-name-first-tag --extract-enums --axios --disableStrictSSL`,
    {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    },
  );

  console.log('✅ Strapi API types generated successfully!');
} catch (error) {
  console.error('❌ Failed to generate Strapi API types:', error.message);
  console.log(
    '💡 Make sure Strapi is running and the documentation plugin is enabled',
  );
  process.exit(1);
}
