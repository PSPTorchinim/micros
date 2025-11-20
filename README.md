# DJ Beat Blaster - Microservices Platform 🎧

![DJ Beat Blaster](https://img.shields.io/badge/DJ-Beat%20Blaster-blue?style=for-the-badge)
![.NET](https://img.shields.io/badge/.NET-9.0-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-latest-47A248?style=for-the-badge&logo=mongodb)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?style=for-the-badge&logo=microsoftsqlserver)
![Strapi](https://img.shields.io/badge/Strapi-5.23.6-2F2E8B?style=for-the-badge&logo=strapi)

A comprehensive microservices platform for DJ services management, built with .NET 9, React, and modern cloud-native technologies.

## 🚀 Overview

DJ Beat Blaster is a full-stack microservices platform designed for professional DJs and DJ service companies. It provides comprehensive tools for managing clients, equipment, music libraries, events, contracts, and business operations.

### Key Features

- 🎵 **Music Management** - Comprehensive music library and playlist management
- 👥 **Client Management** - Customer relationship management and brand handling
- 🎉 **Event Management** - Party/event booking and management system
- 🎛️ **Equipment Management** - DJ equipment inventory and tracking
- 📄 **Document Management** - Contract templates, proposals, and document generation
- ✉️ **Mailing System** - Email campaigns and communication management
- 🔐 **Identity & Security** - JWT-based authentication and authorization
- 🌐 **Content Management** - Strapi-powered CMS for dynamic content
- 📱 **Responsive Frontend** - Modern React-based user interface

## 🏗️ Architecture

This platform follows a microservices architecture with each service owning its data and functionality:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   DJ Panel      │    │   Strapi CMS    │                │
│  │  (React SPA)    │    │  (Node.js CMS)  │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           DJ Host Gateway (YARP)                       ││
│  │        - Routing & Load Balancing                      ││
│  │        - Authentication & Security                     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                 Microservices Layer                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │Identity  │ │  Music   │ │Equipment │ │  Party   │       │
│ │   API    │ │   API    │ │   API    │ │   API    │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│ │ Company  │ │Documents │ │ Mailing  │                    │
│ │   API    │ │   API    │ │   API    │                    │
│ └──────────┘ └──────────┘ └──────────┘                    │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │SQL Server│ │ MongoDB  │ │PostgreSQL│ │  Redis   │       │
│ │(Primary) │ │(Documents│ │ (Strapi) │ │ (Cache)  │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
                             │
┌─────────────────────────────────────────────────────────────┐
│              Infrastructure Layer                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │RabbitMQ  │ │  Docker  │ │Kubernetes│ │  GitHub  │       │
│ │(Messages)│ │(Container│ │ (Orchest.)│ │ Actions  │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Backend Services (.NET 9)

- **Framework**: ASP.NET Core Web API
- **Authentication**: JWT Bearer Tokens
- **Documentation**: Swagger/OpenAPI
- **Database**: Entity Framework Core (SQL Server), MongoDB Driver
- **Caching**: Redis
- **Messaging**: RabbitMQ
- **API Gateway**: YARP (Yet Another Reverse Proxy)

#### Frontend (React 19)

- **Framework**: React 19.1.1 with TypeScript
- **Bundler**: Webpack 5
- **Styling**: CSS Modules + React Icons
- **HTTP Client**: Axios
- **Routing**: React Router DOM 7
- **State Management**: React Context API

#### CMS (Strapi 5)

- **Version**: Strapi 5.23.6
- **Database**: PostgreSQL
- **Plugins**: GraphQL, Users & Permissions

#### Infrastructure

- **Databases**: SQL Server 2022, MongoDB, PostgreSQL
- **Caching**: Redis
- **Message Broker**: RabbitMQ
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes (Helm Charts)
- **CI/CD**: GitHub Actions

## 📦 Services Overview

| Service           | Port | Technology            | Database   | Purpose                          |
| ----------------- | ---- | --------------------- | ---------- | -------------------------------- |
| **DJHostGateway** | 5000 | .NET 9 + YARP         | SQL Server | API Gateway & Routing            |
| **IdentityAPI**   | 5001 | .NET 9 + EF Core      | SQL Server | Authentication & User Management |
| **MusicAPI**      | 5002 | .NET 9 + EF Core      | SQL Server | Music Library & Playlists        |
| **EquipmentAPI**  | 5003 | .NET 9 + EF Core      | SQL Server | Equipment Inventory              |
| **DocumentsAPI**  | 5004 | .NET 9 + MongoDB      | MongoDB    | Document Templates & Generation  |
| **CompanyAPI**    | 5005 | .NET 9 + EF Core      | SQL Server | Brand & Client Management        |
| **PartyAPI**      | 5006 | .NET 9 + EF Core      | SQL Server | Event & Booking Management       |
| **MailingAPI**    | 5007 | .NET 9 + MongoDB      | MongoDB    | Email Campaigns & Templates      |
| **DJ Panel**      | 3000 | React 19 + TypeScript | -          | Frontend Application             |
| **Storybook**     | 6006 | Storybook 10          | -          | Component Documentation          |
| **Strapi CMS**    | 1337 | Strapi 5 + Node.js    | PostgreSQL | Content Management               |
| **Grafana**       | 3001 | Grafana 11            | -          | Logs & Metrics Visualization     |
| **Prometheus**    | 9090 | Prometheus 2.48       | -          | Metrics Aggregation & Storage    |
| **Loki**          | 3100 | Loki 3.3              | Filesystem | Log Aggregation & Storage        |
| **Promtail**      | 9080 | Promtail 3.3          | -          | Log Collection Agent             |

## 🚀 Quick Start

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20+](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) or [VS Code](https://code.visualstudio.com/)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/PSPTorchinim/micros.git
   cd micros
   ```

2. **Start infrastructure services**

   ```bash
   cd Docker
   docker-compose -f dj-panel-composer.yml up -d sqlserver mongodb redis rabbitmq postgres
   ```

3. **Run microservices**

   - Open `Micros.sln` in Visual Studio
   - Select "Local Development" profile for each service
   - Start all services using the multiple startup projects configuration

4. **Start the frontend**

   ```bash
   cd Frontends/dj-panel
   npm install
   npm run dev
   ```

5. **Start Strapi CMS**
   ```bash
   cd CMS
   npm install
   npm run develop
   ```

### Access URLs

- **DJ Panel Frontend**: http://localhost:3000
- **Storybook**: http://localhost:6006
- **API Gateway**: http://localhost:5000/swagger
- **Strapi CMS**: http://localhost:1337/admin
- **Grafana Dashboards**: http://localhost:3001 (admin/djpanel_grafana_admin_2024)
- **Prometheus Metrics**: http://localhost:9090
- **Individual Service Swagger**: http://localhost:500X/swagger

For detailed setup instructions, see [Local Development Setup](LOCAL_DEVELOPMENT_SETUP.md).

## 🐳 Docker Deployment

### Using Docker Compose

```bash
cd Docker
docker-compose -f dj-panel-composer.yml up -d
```

### Using Kubernetes

```bash
cd k8s
helm install dj-beat-blaster .
```

For detailed deployment instructions, see [Docker README](Docker/README.md).

### Rollback Deployment

If a deployment causes issues, use the automated rollback workflow:

1. Go to **Actions** → **Rollback Deployment**
2. Click **Run workflow**
3. Select environment and backup timestamp (use `latest` for most recent)
4. Monitor the rollback process

See **[Rollback Quick Start Guide](ROLLBACK_QUICK_START.md)** for step-by-step instructions, or [Zero Downtime Deployment](ZERO_DOWNTIME_DEPLOYMENT.md#rollback-procedure) for detailed documentation.

## 📚 Documentation

### Platform Documentation

- **[Local Development Setup](LOCAL_DEVELOPMENT_SETUP.md)** - Complete guide for local development
- **[Database Architecture](DATABASE_ARCHITECTURE.md)** - Database design and configuration
- **[Logging Setup](LOGGING_SETUP.md)** - Centralized logging and database monitoring with Grafana, Loki, and Prometheus
- **[Docker Guide](Docker/README.md)** - Docker and deployment guide
- **[Rollback Quick Start](ROLLBACK_QUICK_START.md)** - Quick guide to rollback deployments
- **[Zero Downtime Deployment](ZERO_DOWNTIME_DEPLOYMENT.md)** - Production deployment strategies
- **[TrueNAS Setup](TRUENAS_SETUP_GUIDE.md)** - Storage configuration guide
- **[Changelog Management](CHANGELOG_MANAGEMENT.md)** - Auto-generated changelog documentation

### Service Documentation

- **[Services Overview](Services/README.md)** - Microservices architecture and patterns
- **[IdentityAPI](Services/IdentityAPI/README.md)** - Authentication & user management
- **[MusicAPI](Services/MusicAPI/README.md)** - Music library management
- **[EquipmentAPI](Services/EquipmentAPI/README.md)** - Equipment inventory
- **[DocumentsAPI](Services/DocumentsAPI/README.md)** - Document generation
- **[CompanyAPI](Services/CompanyAPI/README.md)** - Client & brand management
- **[PartyAPI](Services/PartyAPI/README.md)** - Event management
- **[MailingAPI](Services/MailingAPI/README.md)** - Email campaigns
- **[DJHostGateway](Services/DJHostGateway/README.md)** - API Gateway

### Frontend Documentation

- **[DJ Panel Frontend](Frontends/dj-panel/README.md)** - React frontend application
- **[Strapi CMS](CMS/README.md)** - Content management system

## 🧪 Testing

### Backend Tests

```bash
dotnet test
```

### Frontend Tests

```bash
cd Frontends/dj-panel
npm test
```

## 🛠️ Development Tools

### Code Quality

This repository uses automated code quality tools to ensure consistent code style and catch issues early:

- **ESLint**: Automatically lints JavaScript/TypeScript code
- **Prettier**: Automatically formats code according to project standards
- **Husky**: Git hooks for running checks on commit
- **lint-staged**: Runs linters only on staged files for better performance

When you commit changes, the following will happen automatically:
- ESLint will check and auto-fix JavaScript/TypeScript files in `Frontends/dj-panel/src/`
- Prettier will format your code according to project standards
- Only staged files are processed for fast commits

To manually run linting and formatting:

```bash
# From the Frontends/dj-panel directory
npm run lint        # Check for linting issues
npm run lint:fix    # Auto-fix linting issues
npm run format      # Check formatting
npm run format:fix  # Auto-format code
```

### VS Code Extensions

- C# for Visual Studio Code
- ES7+ React/Redux/React-Native snippets
- Docker
- Kubernetes
- REST Client
- ESLint
- Prettier - Code formatter

### Visual Studio Extensions

- Docker Tools
- Kubernetes Tools
- Web Essentials

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited. See the [LICENSE](LICENSE) file for details.

## 🔧 Configuration

### Environment Variables

Each service can be configured using environment variables. Key configurations include:

- **Database Connections**: SQL Server, MongoDB, Redis
- **Security Keys**: JWT keys, API secure keys
- **Service URLs**: For service-to-service communication
- **External APIs**: Third-party service integrations

See [Local Development Setup](LOCAL_DEVELOPMENT_SETUP.md) for complete configuration details.

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 5000-5007, 3000, and 1337 are available
2. **Database Connection**: Verify SQL Server and MongoDB are running
3. **Service Discovery**: Check that all services are running on configured ports
4. **Authentication**: Ensure JWT keys are properly configured across services

For more troubleshooting help, check the [Issues](https://github.com/PSPTorchinim/micros/issues) section.

## 📊 Project Status

This is an active development project. Check the [GitHub Actions](https://github.com/PSPTorchinim/micros/actions) page for current build and test status.

![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)

## 🌟 Features Roadmap

- [ ] Advanced reporting and analytics
- [ ] Mobile application (React Native)
- [ ] Real-time notifications (SignalR)
- [ ] Advanced search and filtering
- [ ] Payment integration
- [ ] Calendar synchronization
- [ ] Multi-language support
- [ ] Advanced caching strategies

## 📞 Support

For support and questions, please use the [GitHub Issues](https://github.com/PSPTorchinim/micros/issues) page.

---

<div align="center">
  <strong>Developed by PSPTorchinim</strong>
</div>
