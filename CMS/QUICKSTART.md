# CMS Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1️⃣ Install & Configure

```bash
cd CMS
npm install
# Configure .env file with database credentials and secrets
```

### 2️⃣ Generate TypeScript Types ⚡

**IMPORTANT**: This step is required for TypeScript to recognize all content types!

#### Option A: Command Line
```bash
npm run ts:generate-types
```

#### Option B: VS Code (Automatic)
When using VS Code's debugger, types are automatically generated:
1. Press `F5` or use the "CMS: Strapi Debug" launch configuration
2. The `generate-strapi-types` task runs automatically before launch
3. Uses DevelopmentLocal environment variables from `.vscode/launch.json`

**Why?** This generates TypeScript definitions for all Strapi content types, ensuring type safety and preventing compilation errors.

### 3️⃣ Start Development

#### Command Line:
```bash
npm run develop
```

#### VS Code Debugger:
Press `F5` and select "CMS: Strapi Debug" - types are generated automatically!

Visit: `http://localhost:1337/admin`

---

## 🔧 When to Run Type Generation

Run `npm run ts:generate-types` after:
- ✅ Initial setup
- ✅ Pulling code with new content types
- ✅ Creating/modifying content types
- ✅ Seeing TypeScript errors about missing types

**Note**: VS Code launch configuration handles this automatically!

## 📝 Common Commands

```bash
# Development mode (with auto-reload)
npm run develop

# Generate types (after schema changes)
npm run ts:generate-types

# Build for production
npm run build

# Start production server
npm run start

# Run tests
npm test
```

## 🎯 VS Code Integration

The repository includes VS Code tasks and launch configurations:

### Tasks:
- **install-strapi**: Install dependencies
- **generate-strapi-types**: Generate TypeScript types with DevelopmentLocal env
- **build-strapi**: Build the CMS (includes type generation)

### Launch Configurations:
- **CMS: Strapi Debug**: Launch with automatic type generation
- **Launch Frontends Stack**: Start CMS + DJ Panel + Storybook
- **Launch Full Stack**: Start all services and frontends

Press `F5` or `Cmd/Ctrl+Shift+D` to access debug configurations.

## ⚠️ Troubleshooting

**TypeScript Error: Content type not assignable**
```bash
npm run ts:generate-types
```
Or press `F5` in VS Code to regenerate automatically.

**Missing environment variables**
- Ensure `.env` file is configured with all required variables
- VS Code users: Environment is auto-configured in `.vscode/launch.json`
- See `DEVELOPMENT.md` for full variable list

**Database connection failed**
- Check database is running
- Verify DATABASE_* variables in `.env` or `.vscode/launch.json`

---

📖 **Full documentation**: See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup and troubleshooting.
