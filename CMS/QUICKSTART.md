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

```bash
npm run ts:generate-types
```

**Why?** This generates TypeScript definitions for all Strapi content types, ensuring type safety and preventing compilation errors.

### 3️⃣ Start Development

```bash
npm run develop
```

Visit: `http://localhost:1337/admin`

---

## 🔧 When to Run Type Generation

Run `npm run ts:generate-types` after:
- ✅ Initial setup
- ✅ Pulling code with new content types
- ✅ Creating/modifying content types
- ✅ Seeing TypeScript errors about missing types

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

## ⚠️ Troubleshooting

**TypeScript Error: Content type not assignable**
```bash
npm run ts:generate-types
```

**Missing environment variables**
- Ensure `.env` file is configured with all required variables
- See `DEVELOPMENT.md` for full variable list

**Database connection failed**
- Check database is running
- Verify DATABASE_* variables in `.env`

---

📖 **Full documentation**: See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup and troubleshooting.
