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
};

function generateTypesForService(serviceName, config) {
  const swaggerUrl = `${process.env.REACT_APP_API_GATEWAY}${config.swaggerPath}`;

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

  // Import specific APIs only
  const imports = [];
  const serviceNames = [];

  for (const serviceName of Object.keys(microservices)) {
    const capitalizedName =
      serviceName.charAt(0).toUpperCase() + serviceName.slice(1);

    // Import only the Api class with a renamed alias to avoid conflicts
    imports.push(
      `import { Api as ${capitalizedName}Api } from './${serviceName}/apiMap';`,
    );

    serviceNames.push({
      name: serviceName,
      className: `${capitalizedName}Api`,
    });
  }

  mergedContent += imports.join('\n') + '\n\n';

  // Define and EXPORT our own types
  mergedContent += `// Define basic types for API configuration - EXPORTED
export interface ApiConfig<SecurityDataType = unknown> {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  validateStatus?: (status: number) => boolean;
  securityWorker?: (securityData: SecurityDataType | null) => any;
  [key: string]: any;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: any;
  constructor(config: ApiConfig<SecurityDataType> = {}) {
    // Basic implementation - actual functionality comes from generated APIs
    this.instance = config;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type RequestParams = any;
export type FullRequestParams = any;

`;

  // Add the unified API class
  mergedContent += `/**
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

  mergedContent += `  }

  /**
   * Set security data for all services
   */
  public setSecurityData(data: SecurityDataType | null) {
`;

  // Set security data for all services
  for (const { name } of serviceNames) {
    mergedContent += `    if (this.${name}.setSecurityData) {
      this.${name}.setSecurityData(data);
    }\n`;
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
`;

  for (const { name, className } of serviceNames) {
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    mergedContent += `export const create${capitalizedName}Api = <T = unknown>(config: ApiConfig<T> = {}) => new ${className}(config);\n`;
  }

  // Write the merged API file
  fs.writeFileSync(outputPath, mergedContent);
  console.log(`✅ Merged API client generated at: ${outputPath}`);

  // Generate service-specific type exports
  generateServiceTypeExports();

  // Generate index file for easy imports
  generateIndexFile();
}

function generateServiceTypeExports() {
  console.log('🔄 Generating service-specific type exports...');

  for (const serviceName of Object.keys(microservices)) {
    const capitalizedName =
      serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    const exportPath = path.join(
      __dirname,
      '..',
      'src',
      'models',
      'api',
      `${serviceName}.ts`,
    );

    const exportContent = `/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## ${capitalizedName.toUpperCase()} SERVICE TYPE EXPORTS     ##
 * ---------------------------------------------------------------
 */

// Import all types from the service
import * as ${capitalizedName}Types from './${serviceName}/apiMap';

// Export the Api class with a specific name to avoid conflicts
export { Api as ${capitalizedName}Api } from './${serviceName}/apiMap';

// Try to export other types safely (without re-exporting to avoid conflicts)
export type ${capitalizedName}QueryParamsType = ${capitalizedName}Types.QueryParamsType;
export type ${capitalizedName}RequestParams = ${capitalizedName}Types.RequestParams;
export type ${capitalizedName}FullRequestParams = ${capitalizedName}Types.FullRequestParams;
export type ${capitalizedName}ApiConfig = ${capitalizedName}Types.ApiConfig<any>;

// Create a namespace export for clean access to all types
export namespace ${capitalizedName} {
  // Re-export all types within the namespace
  export type Api<T = any> = ${capitalizedName}Types.Api<T>;
  export const ContentType = ${capitalizedName}Types.ContentType;
  export type HttpClient<T = any> = ${capitalizedName}Types.HttpClient<T>;
  export type QueryParamsType = ${capitalizedName}Types.QueryParamsType;
  export type RequestParams = ${capitalizedName}Types.RequestParams;
  export type FullRequestParams = ${capitalizedName}Types.FullRequestParams;
  export type ApiConfig<T = any> = ${capitalizedName}Types.ApiConfig<T>;
}
`;

    fs.writeFileSync(exportPath, exportContent);
  }

  console.log('✅ Service-specific type exports generated');
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

// Export ONLY the main API client classes and functions (no types to avoid warnings)
export { 
  microservicesClient, 
  createApi, 
  UnifiedApi
} from './api';

// Export individual service creators
${Object.keys(microservices)
  .map((service) => {
    const capitalizedName = service.charAt(0).toUpperCase() + service.slice(1);
    return `export { create${capitalizedName}Api } from './api';`;
  })
  .join('\n')}

// Export service-specific namespaces
${Object.keys(microservices)
  .map((service) => {
    const capitalizedName = service.charAt(0).toUpperCase() + service.slice(1);
    return `export { ${capitalizedName} } from './${service}';`;
  })
  .join('\n')}

// Export service-specific API classes with unique names
${Object.keys(microservices)
  .map((service) => {
    const capitalizedName = service.charAt(0).toUpperCase() + service.slice(1);
    return `export { ${capitalizedName}Api } from './${service}';`;
  })
  .join('\n')}

// Types are available via direct imports if needed:
// import type { ApiConfig, ContentType, QueryParamsType } from './api';
// or via namespaced imports:
// import type { Brand } from './brand';
// const config: Brand.ApiConfig = {};
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
      console.log('\n📖 Usage examples:');
      console.log('// Using unified client:');
      console.log('import { microservicesClient } from "@/models/api";');
      console.log(
        'const result = await microservicesClient.identity.users.apiV1UsersLoginCreate({',
      );
      console.log('  email: "user@example.com",');
      console.log('  password: "password"');
      console.log('});');
      console.log('');
      console.log('// Using individual service client:');
      console.log('import { createIdentityApi } from "@/models/api";');
      console.log('const identityApi = createIdentityApi();');
      console.log('');
      console.log('// Using service-specific types:');
      console.log('import { Identity } from "@/models/api";');
      console.log(
        'const loginData: Identity.LoginUserRequestDTO = { email: "...", password: "..." };',
      );
      console.log('');
      console.log('// Direct type imports (if needed):');
      console.log(
        'import { LoginUserRequestDTO } from "@/models/api/identity/apiMap";',
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
