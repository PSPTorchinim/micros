# CMS Development Guide

## 🛠️ Local Development Environment Setup

This guide will help you set up the CMS for local development and ensure TypeScript types are properly generated.

### Prerequisites

- Node.js >= 20.0.0
- npm >= 6.0.0
- PostgreSQL database (or another supported database)
- Git

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd micros/CMS
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the CMS directory with the following variables:

```env
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_cms
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password

# Server Configuration
NODE_ENV=development
HOST=0.0.0.0
PORT=1337

# Security Keys (generate secure random strings)
JWT_SECRET=your_jwt_secret_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
TRANSFER_TOKEN_SALT=your_transfer_token_salt
```

**Security Note**: Use strong, randomly generated strings for all secrets. You can generate them using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 4. Set Up the Database

Ensure your PostgreSQL database is running and accessible with the credentials in your `.env` file.

#### 5. Generate TypeScript Types (Critical Step!)

After installing dependencies and configuring the environment, generate TypeScript types for all content types:

```bash
npm run ts:generate-types
```

This command:
- Connects to the database using your environment configuration
- Scans all content type schemas
- Generates TypeScript type definitions
- Ensures type safety across controllers, services, and routes

**When to Run This Command:**
- ✅ After initial setup
- ✅ After pulling changes with new/modified content types
- ✅ After creating new content types in the admin panel
- ✅ When you see TypeScript errors about missing content types

**Troubleshooting Type Generation:**
- If the command fails with "Missing admin.auth.secret", ensure all environment variables are set
- If database connection fails, verify your DATABASE_* environment variables
- Run `npm run strapi version` to ensure Strapi CLI is properly installed

#### 6. Build the Application

```bash
npm run build
```

This builds the admin panel and compiles TypeScript files.

#### 7. Start Development Server

```bash
npm run develop
```

The CMS admin panel will be available at `http://localhost:1337/admin`

### Development Workflow

#### Adding New Content Types

When you add a new content type (either through the admin panel or by creating schema files):

1. **Create the content type** in Strapi admin or add schema files
2. **Generate TypeScript types**:
   ```bash
   npm run ts:generate-types
   ```
3. **Restart the development server** if it's running
4. **Use the generated types** in your controllers/services:
   ```typescript
   // Now TypeScript recognizes the new content type
   export default factories.createCoreController("api::your-content-type.your-content-type");
   ```

#### Working with Existing Content Types

If you encounter TypeScript errors like:
```
error TS2345: Argument of type '"api::your-type.your-type"' is not assignable to parameter of type 'ContentType'
```

**Solution**: Run `npm run ts:generate-types` to regenerate type definitions.

### Common Development Commands

```bash
# Start with auto-reload (development mode)
npm run develop

# Build admin panel
npm run build

# Start in production mode
npm run start

# Generate TypeScript types
npm run ts:generate-types

# Run tests
npm test

# Open Strapi console
npm run console
```

### CI/CD Integration

The type generation is also integrated into the CI/CD pipeline:

1. **Build Pipeline**: Types are generated during the Docker build process
2. **Local Development**: Run `npm run ts:generate-types` after setup
3. **Pre-deployment**: Types are verified in the build artifacts

### Best Practices

1. **Always generate types** after modifying content type schemas
2. **Commit generated types** to version control (if they exist in `types/` directory)
3. **Document new content types** in your PR descriptions
4. **Run type generation** before pushing code to ensure CI/CD passes
5. **Use TypeScript** in controllers and services for type safety

### Troubleshooting

#### TypeScript Errors for New Content Types

**Problem**: New content type not recognized by TypeScript
**Solution**: 
```bash
npm run ts:generate-types
```

#### Missing Environment Variables

**Problem**: `Missing admin.auth.secret configuration`
**Solution**: Ensure all required environment variables are set in `.env`

#### Database Connection Issues

**Problem**: Cannot connect to database during type generation
**Solution**: 
1. Verify database is running
2. Check DATABASE_* variables in `.env`
3. Ensure database user has proper permissions

#### Build Failures

**Problem**: Build fails with TypeScript errors
**Solution**:
1. Run `npm run ts:generate-types`
2. Clean build cache: `rm -rf .cache build dist`
3. Rebuild: `npm run build`

### Additional Resources

- [Strapi TypeScript Documentation](https://docs.strapi.io/dev-docs/typescript)
- [Strapi CLI Documentation](https://docs.strapi.io/dev-docs/cli)
- [Content Type Schema Documentation](https://docs.strapi.io/dev-docs/backend-customization/models)

### Support

For issues specific to this project, please:
1. Check this documentation first
2. Review existing issues in the repository
3. Ask in the team's communication channel
4. Create a new issue with detailed error messages and steps to reproduce
