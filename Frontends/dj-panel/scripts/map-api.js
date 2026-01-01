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

// Define microservices configuration
const microservices = {
  brand: {
    swaggerPath: '/swagger/Brand/swagger.json',
    outputFile: './src/models/api/brand',
  },
  documents: {
    swaggerPath: '/swagger/Documents/swagger.json',
    outputFile: './src/models/api/documents',
  },
  gear: {
    swaggerPath: '/swagger/Gear/swagger.json',
    outputFile: './src/models/api/gear',
  },
  identity: {
    swaggerPath: '/swagger/Identity/swagger.json',
    outputFile: './src/models/api/identity',
  },
  mailing: {
    swaggerPath: '/swagger/Mailing/swagger.json',
    outputFile: './src/models/api/mailing',
  },
  music: {
    swaggerPath: '/swagger/Music/swagger.json',
    outputFile: './src/models/api/music',
  },
  party: {
    swaggerPath: '/swagger/Party/swagger.json',
    outputFile: './src/models/api/party',
  },
  strapi: {
    swaggerPath: '/swagger/Strapi/swagger.json',
    outputFile: './src/models/api/strapi',
  },
};

function generateTypesForService(serviceName, config) {
  const swaggerUrl = `${process.env.REACT_APP_API_GATEWAY ?? 'http://localhost:5000'}${config.swaggerPath}`;

  console.log(`🔄 Generating ${serviceName} API types from: ${swaggerUrl}`);
  console.log(`📁 Output file: ${config.outputFile}`);

  try {
    execSync(
      `npx swagger-typescript-api generate -p "${swaggerUrl}" -o ${config.outputFile} -n apiMap.ts --module-name-first-tag --extract-enums --axios --disableStrictSSL`,
      {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      },
    );

    // Add alias exports for Api, ContentType, HttpClient
    const capitalizedName =
      serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    const apiMapPath = path.join(
      __dirname,
      '..',
      'src',
      'models',
      'api',
      serviceName,
      'apiMap.ts',
    );
    let aliasExport = `\n// Aliased exports for unified API client\n`;
    aliasExport += `export { Api as ${capitalizedName}Api, ContentType as ${capitalizedName}ContentType, HttpClient as ${capitalizedName}HttpClient };\n`;

    // Inject secure_key interceptor into Api class
    let secureKeyInterceptor = `\n// Injected secure_key header interceptor\n`;
    secureKeyInterceptor += `if (typeof Api === 'function' && Api.prototype && Api.prototype.instance) {\n`;
    secureKeyInterceptor += `  const secureKey = process.env.REACT_APP_API_SECURE_KEY || (typeof window !== 'undefined' ? window.REACT_APP_API_SECURE_KEY : undefined);\n`;
    secureKeyInterceptor += `  if (secureKey && Api.prototype.instance && Api.prototype.instance.interceptors && Api.prototype.instance.interceptors.request) {\n`;
    secureKeyInterceptor += `    Api.prototype.instance.interceptors.request.use((config) => {\n`;
    secureKeyInterceptor += `      if (!config.headers) config.headers = {};\n`;
    secureKeyInterceptor += `      config.headers['secure_key'] = secureKey;\n`;
    secureKeyInterceptor += `      return config;\n`;
    secureKeyInterceptor += `    });\n`;
    secureKeyInterceptor += `  }\n`;
    secureKeyInterceptor += `}\n`;

    try {
      fs.appendFileSync(apiMapPath, aliasExport + secureKeyInterceptor);
      console.log(
        `✅ Added alias exports and secure_key interceptor to ${apiMapPath}`,
      );
    } catch (err) {
      console.warn(
        `⚠️  Could not append alias exports/interceptor to ${apiMapPath}:`,
        err.message,
      );
    }
    console.log(`✅ ${serviceName} API types generated successfully!`);
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to generate ${serviceName} API types:`,
      error.message,
    );
    return false;
  }
}

function generateMergedApiClient() {
  console.log('🔄 Generating merged API client...');

  const outputPath = path.join(
    __dirname,
    '..',
    'src',
    'models',
    'api',
    'api.ts',
  );

  let mergedContent = `/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA API MERGER SCRIPT            ##
 * ##                                                           ##
 * ## Combines all microservice APIs into a single client      ##
 * ---------------------------------------------------------------
 */

`;

  // Import all service APIs and their types
  // Import only aliased main types to avoid conflicts
  const imports = [];
  const exports = [];
  const serviceNames = [];

  for (const serviceName of Object.keys(microservices)) {
    const capitalizedName =
      serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    imports.push(
      `import { Api as ${capitalizedName}Api, ContentType as ${capitalizedName}ContentType, HttpClient as ${capitalizedName}HttpClient } from './${serviceName}/apiMap';`,
    );
    exports.push(
      `export { ${capitalizedName}Api, ${capitalizedName}ContentType, ${capitalizedName}HttpClient } from './${serviceName}/apiMap';`,
    );
    serviceNames.push({
      name: serviceName,
      className: `${capitalizedName}Api`,
    });
  }

  mergedContent += imports.join('\n') + '\n\n';
  mergedContent += exports.join('\n') + '\n\n';

  // Inject secure_key header interceptor for all service instances
  mergedContent += `\n// Injected secure_key header interceptor for all services\n`;
  mergedContent += `const __secureKey = process.env.REACT_APP_API_SECURE_KEY || (typeof window !== 'undefined' ? window.REACT_APP_API_SECURE_KEY : undefined);\n`;
  mergedContent += `const __servicesWithInterceptor = [`;
  mergedContent +=
    serviceNames
      .map(({ name }) => `microservicesClient?.${name}?.instance`)
      .join(', ') + `];\n`;
  mergedContent += `__servicesWithInterceptor.forEach(instance => {\n`;
  mergedContent += `  if (instance && instance.interceptors && instance.interceptors.request && __secureKey) {\n`;
  mergedContent += `    instance.interceptors.request.use(config => {\n`;
  mergedContent += `      if (!config.headers) config.headers = {};\n`;
  mergedContent += `      config.headers['secure_key'] = __secureKey;\n`;
  mergedContent += `      return config;\n`;
  mergedContent += `    });\n`;
  mergedContent += `  }\n`;
  mergedContent += `});\n`;

  // Add ApiConfig import
  mergedContent += `import { ApiConfig } from './brand/apiMap';\n\n`;

  // Add constants and configuration
  mergedContent += `const NUMBER_OF_RETRIES = 3;

/**
 * Unified API client that combines all microservice APIs
 */
export class UnifiedApi<SecurityDataType extends unknown> {
`;

  // Add service properties
  for (const { name, className } of serviceNames) {
    mergedContent += `  public ${name}: ${className}<SecurityDataType>;\n`;
  }

  mergedContent += `
  constructor(config: ApiConfig<SecurityDataType> = {}) {
    // Apply default configuration
    const defaultConfig = {
      baseURL: process.env.REACT_APP_API_GATEWAY || '',
      withCredentials: true,
      validateStatus: (status: number) => status >= 200 && status < 300,
      ...config,
    };

`;

  // Initialize all service APIs
  for (const { name, className } of serviceNames) {
    mergedContent += `    this.${name} = new ${className}(defaultConfig);\n`;
  }

  // Add secure_key header interceptor setup
  // This automatically adds the secure_key header from REACT_APP_API_SECURE_KEY
  // to all API requests for backend authentication
  mergedContent += `
    // Setup secure_key header interceptor for all services
    this.setupSecureKeyInterceptor();
  }

  /**
   * Setup request interceptor to add secure_key header to all requests
   */
  private setupSecureKeyInterceptor() {
    const secureKey = process.env.REACT_APP_API_SECURE_KEY;
    
    if (!secureKey) {
      console.warn('REACT_APP_API_SECURE_KEY is not set. API requests may fail authentication.');
      return;
    }

    // Add interceptor to all service instances
    const services = [
`;

  // Add service names to the array
  for (const { name } of serviceNames) {
    mergedContent += `      this.${name},\n`;
  }

  mergedContent += `    ];

    services.forEach((service) => {
      if (service.instance) {
        service.instance.interceptors.request.use(
          (config) => {
            // Ensure headers object exists
            if (!config.headers) {
              config.headers = {} as any;
            }
            // Add secure_key header to all requests if not already set
            if (!config.headers['secure_key']) {
              config.headers['secure_key'] = secureKey;
            }
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
        );
      }
    });
  }

  /**
   * Set security data for all services
   */
  public setSecurityData(data: SecurityDataType | null) {
`;

  // Set security data for all services
  for (const { name } of serviceNames) {
    mergedContent += `    this.${name}.setSecurityData(data);\n`;
  }

  mergedContent += `  }

  /**
   * Update base URL for all services
   */
  public setBaseURL(baseUrl: string) {
`;

  // Update base URL for all services
  for (const { name } of serviceNames) {
    mergedContent += `    if (this.${name}.instance) {
      this.${name}.instance.defaults.baseURL = baseUrl;
    }\n`;
  }

  mergedContent += `  }
}

/**
 * Create a new unified API instance with custom configuration
 */
export function createApi<SecurityDataType extends unknown>(
  config: ApiConfig<SecurityDataType> = {}
): UnifiedApi<SecurityDataType> {
  return new UnifiedApi<SecurityDataType>(config);
}

/**
 * Default unified API instance
 */
export const microservicesClient = createApi();

// Export individual service clients for direct access if needed
export const createBrandApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'brand')?.className || 'BrandApi'}(config);
export const createDocumentsApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'documents')?.className || 'DocumentsApi'}(config);
export const createGearApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'gear')?.className || 'GearApi'}(config);
export const createIdentityApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'identity')?.className || 'IdentityApi'}(config);
export const createMailingApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'mailing')?.className || 'MailingApi'}(config);
export const createMusicApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'music')?.className || 'MusicApi'}(config);
export const createPartyApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'party')?.className || 'PartyApi'}(config);
export const createStrapiApi = (config?: ApiConfig) => new ${serviceNames.find((s) => s.name === 'strapi')?.className || 'StrapiApi'}(config);
`;

  // Write the merged API file
  fs.writeFileSync(outputPath, mergedContent);
  console.log(`✅ Merged API client generated at: ${outputPath}`);

  // Generate index file for easy imports
  generateIndexFile();
}

function generateIndexFile() {
  console.log('🔄 Generating index file...');

  const indexPath = path.join(
    __dirname,
    '..',
    'src',
    'models',
    'api',
    'index.ts',
  );

  const indexContent = `/* eslint-disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## API MODELS INDEX FILE                                     ##
 * ##                                                           ##
 * ## Central export point for all API models and clients      ##
 * ---------------------------------------------------------------
 */

// Export the main API client (similar to your existing aocmsAxiosClient)
export { microservicesClient, createApi, UnifiedApi } from './api';

// Export individual service creators
export {
  createBrandApi,
  createDocumentsApi,
  createGearApi,
  createIdentityApi,
  createMailingApi,
  createMusicApi,
  createPartyApi,
} from './api';

// Export all types and interfaces
export * from './api';

// Re-export individual service modules for direct access if needed
${Object.keys(microservices)
  .map(
    (service) =>
      `export * as ${service.charAt(0).toUpperCase() + service.slice(1)} from './${service}/apiMap';`,
  )
  .join('\n')}
`;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`✅ Index file generated at: ${indexPath}`);
}

async function main() {
  console.log('🚀 Starting API types generation for microservices...\n');

  let successCount = 0;
  let totalServices = 0;

  // Generate individual service APIs
  for (const [serviceName, config] of Object.entries(microservices)) {
    totalServices++;
    if (generateTypesForService(serviceName, config)) {
      successCount++;
    }
    console.log('');
  }

  console.log('📊 Individual Services Generation Summary:');
  console.log(`✅ Successful: ${successCount}/${totalServices} services\n`);

  if (successCount === 0) {
    console.error(
      '❌ No API types were generated. Please check your environment variables.',
    );
    process.exit(1);
  }

  // Generate merged API client if we have at least some successful generations
  if (successCount > 0) {
    try {
      generateMergedApiClient();
      console.log('\n🎉 Merged API client generated successfully!');
      console.log('\n📖 Usage example:');
      console.log('import { microservicesClient } from "@/models";');
      console.log(
        'const brands = await microservicesClient.brand.brands.apiV1BrandsList();',
      );
    } catch (error) {
      console.error('❌ Failed to generate merged API client:', error.message);
      process.exit(1);
    }
  }

  if (successCount < totalServices) {
    console.warn(
      '\n⚠️  Some services failed to generate types. Check the logs above.',
    );
    process.exit(0);
  } else {
    console.log('\n🎉 All API types and merged client generated successfully!');
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
