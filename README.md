# 🧠 Wired — Neural Knowledge Graph System

> A self-organizing knowledge graph platform that uses AI embeddings and graph algorithms to automatically discover semantic connections between ideas, visualized in an interactive 3D interface.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Project Status](#-project-status)

---

## 🎯 Overview

**Wired** is a full-stack knowledge management system that transforms how you organize and connect ideas. Unlike traditional note-taking apps, Wired automatically discovers semantic relationships between your thoughts, creating a living network of interconnected concepts.

### What Makes It Different

- **Automatic Connection Discovery**: AI analyzes content and creates semantic links without manual tagging
- **Context-Aware Matching**: Uses surrounding connections to find more relevant relationships
- **Dynamic Relevance Scoring**: Memory weight algorithm determines which ideas stay active
- **3D Graph Visualization**: Interactive Three.js interface for exploring your knowledge network
- **Temporal Intelligence**: Graph temperature system simulates memory decay and reinforcement

### Use Cases

- Personal knowledge management and second brain systems
- Research organization with automatic literature linking
- Project planning with interconnected task networks
- Creative ideation with inspiration mapping
- Learning systems with concept relationship tracking

---

## 📁 Project Structure

This is a **Turborepo monorepo** containing multiple applications and shared packages:

```
wired/
├── apps/
│   ├── api/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── connection-system/    # AI connection engine
│   │   │   ├── entities/             # TypeORM entities
│   │   │   ├── openai/               # AI integration layer
│   │   │   ├── use-cases/            # Business logic
│   │   │   └── utils/                # Utility functions
│   │   └── README.md           # Detailed API documentation
│   │
│   └── web/                    # Next.js Frontend (In Development)
│       ├── app/                # Next.js 14 app directory
│       └── public/             # Static assets
│
├── packages/
│   ├── ui/                     # Shared React components
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configs
│
├── package.json                # Root package configuration
├── turbo.json                  # Turborepo configuration
└── README.md                   # This file
```

---

## ✨ Key Features

### Backend (NestJS API)

#### 🤖 AI-Driven Connection Engine
- Automatic semantic link discovery using OpenAI embeddings
- Multi-factor similarity scoring (content, tags, type, recency)
- Context-aware matching using connection neighborhoods
- Bidirectional relationship creation with confidence scoring

#### 🧮 Sophisticated Algorithms
- **Graph Temperature**: Type-based temporal windows for memory simulation
- **Memory Weight**: Dynamic relevance scoring with decay and reinforcement
- **Tag-Based Boosting**: Dual-layer semantic matching (content + metadata)
- **Recency Weighting**: Time-aware connection prioritization

#### 🗄️ Vector Database Integration
- PostgreSQL with pgvector extension for efficient similarity search
- 1536-dimensional embeddings for semantic content representation
- Optimized cosine distance queries for candidate selection

#### 📊 Rich Data Model
- 11 node types (thought, idea, task, memory, goal, etc.)
- 8 semantic relation types (inspired_by, contradicts, similar_to, etc.)
- Computed properties (connection count, average confidence, last activity)
- Metadata tracking (tags, source, position, timestamps)

### Frontend (Next.js - In Development)

- **3D Graph Visualization**: Interactive Three.js/React Three Fiber interface
- **Real-time Updates**: Live graph changes as connections form
- **Node Management**: Create, edit, and organize thoughts
- **Exploration Tools**: Navigate semantic relationships visually

---

## 🛠️ Technology Stack

### Backend
- **NestJS 11** - Modular Node.js framework
- **TypeORM 0.3** - ORM with PostgreSQL support
- **PostgreSQL + pgvector** - Vector database for embeddings
- **OpenAI API** - GPT-4o-mini for completions, text-embedding-3-small for vectors
- **TypeScript 5.7** - Type-safe development

### Frontend
- **Next.js 14** - React framework with App Router
- **Three.js / React Three Fiber** - 3D visualization
- **TypeScript** - Type safety across the stack
- **TailwindCSS** - Utility-first styling

### Development Tools
- **Turborepo** - Monorepo build system
- **Yarn 4** - Package management with workspaces
- **ESLint + Prettier** - Code quality and formatting
- **Jest** - Testing framework

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or Bun
- **PostgreSQL 14+** with pgvector extension
- **OpenAI API Key**
- **Yarn 4** (or npm/pnpm)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd wired

# Install dependencies
yarn install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your credentials
```

### Database Setup

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE wired;

-- Enable vector extension
\c wired
CREATE EXTENSION IF NOT EXISTS vector;
```

### Environment Configuration

Create `apps/api/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wired

# OpenAI
OPENAI_KEY=sk-proj-your-key-here

# Application
PORT=3000
NODE_ENV=development
```

### Running the Project

```bash
# Start all applications in development mode
yarn dev

# Or run specific apps
yarn dev --filter=api    # Backend only
yarn dev --filter=web    # Frontend only

# Build for production
yarn build

# Run linting
yarn lint

# Format code
yarn format
```

The API will be available at `http://localhost:3000`  
The web app will be available at `http://localhost:3001`

---

## 💻 Development

### Monorepo Commands

```bash
# Install dependencies for all workspaces
yarn install

# Run development servers (parallel)
yarn dev

# Build all packages
yarn build

# Lint all packages
yarn lint

# Format all code
yarn format

# Type check all packages
yarn check-types
```

### Working with Specific Apps

```bash
# API development
cd apps/api
yarn dev              # Start dev server
yarn build            # Build for production
yarn test             # Run tests
yarn test:e2e         # Run E2E tests

# Web development
cd apps/web
yarn dev              # Start Next.js dev server
yarn build            # Build for production
yarn start            # Start production server
```

### Turborepo Features

This project uses [Turborepo](https://turborepo.com) for:
- **Parallel execution** of tasks across workspaces
- **Intelligent caching** of build outputs
- **Dependency graph** awareness for optimal task scheduling
- **Remote caching** support (optional)

---

## 🏗️ Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│              Next.js + Three.js + React                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST API
┌──────────────────────────▼──────────────────────────────────┐
│                      NestJS API Server                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Connection Engine Service                      │ │
│  │  • Candidate Selection  • Similarity Scoring           │ │
│  │  • AI Classification    • Reinforcement Learning       │ │
│  └────────────────────┬───────────────────────────────────┘ │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────────┐ │
│  │              OpenAI Service Layer                      │ │
│  │  • Embeddings        • Completions                     │ │
│  │  • Relation Summaries • Tag Generation                │ │
│  └────────────────────┬───────────────────────────────────┘ │
└───────────────────────┼──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│          PostgreSQL + pgvector Extension                     │
│  • Nodes (with vector embeddings)                            │
│  • Connections (semantic relationships)                      │
│  • Metadata (tags, positions, sources)                       │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User creates a node** → Content sent to API
2. **API generates embeddings** → OpenAI creates 1536D vector
3. **AI analyzes content** → Extracts title, summary, sentiment, importance, type, tags
4. **Node saved to database** → PostgreSQL stores with vector
5. **Connection Engine activates** → Finds similar nodes using context-aware matching
6. **Relationships created** → Bidirectional connections with confidence scores
7. **Graph updates** → Frontend visualizes new connections in 3D

---

## 📚 Documentation

### Detailed Documentation

- **[API Documentation](./apps/api/README.md)** - Complete backend architecture, algorithms, and API reference
  - Connection Engine deep dive
  - Memory weight formula explanation
  - Vector similarity algorithms
  - Database schema and relationships
  - Environment setup and configuration

### Key Concepts

#### Graph Temperature
Type-based temporal windows that determine how far back in time the system searches for connections. Active nodes maintain longer search windows, simulating human memory patterns.

#### Memory Weight
A dynamic relevance score (0-1) that adjusts based on connection activity, recency, and importance. Nodes with high memory weight resist decay and form more connections.

#### Context-Aware Matching
Instead of comparing nodes in isolation, the system creates a context embedding by averaging a node's embedding with its connected neighbors, leading to more coherent clusters.

#### Tag-Based Boosting
Dual-layer semantic matching using both content embeddings and metadata tag embeddings. Tags provide categorical similarity signals that boost connection confidence.

---

## 🔮 Project Status

### Current Status: **Active Development** 🚧

#### ✅ Completed
- [x] NestJS API architecture
- [x] PostgreSQL + pgvector integration
- [x] OpenAI embedding and completion pipeline
- [x] Connection Engine with multi-factor scoring
- [x] Context-aware similarity matching
- [x] Tag-based semantic boosting
- [x] Memory weight and graph temperature algorithms
- [x] Bidirectional relationship creation
- [x] TypeORM entity models
- [x] REST API endpoints

#### 🚧 In Progress
- [ ] Next.js frontend application
- [ ] 3D graph visualization with Three.js
- [ ] User authentication and authorization
- [ ] Real-time updates via WebSockets
- [ ] Node editing and management UI

#### 📋 Planned
- [ ] Advanced graph analytics dashboard
- [ ] Natural language search across nodes
- [ ] Clustering algorithms for concept groups
- [ ] Memory decay background jobs
- [ ] Multi-modal support (images, audio)
- [ ] Export/import functionality
- [ ] Collaborative graphs (shared spaces)
- [ ] Mobile application

---

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests for specific package
yarn test --filter=api

# Run E2E tests
yarn test:e2e --filter=api

# Run tests in watch mode
yarn test:watch --filter=api

# Generate coverage report
yarn test:cov --filter=api
```

---

## 📦 Building for Production

```bash
# Build all apps and packages
yarn build

# Build specific app
yarn build --filter=api
yarn build --filter=web

# Start production server (after build)
cd apps/api && yarn start:prod
cd apps/web && yarn start
```

---

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome!

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and tests (`yarn lint && yarn test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and embedding models
- **pgvector** for PostgreSQL vector search capabilities
- **NestJS** team for the excellent framework
- **Vercel** for Next.js and Turborepo
- Inspired by research in cognitive science, neural networks, and knowledge graphs

---

## 🔗 Useful Links

### Project Resources
- [API Documentation](./apps/api/README.md)
- [Frontend Documentation](./apps/web/README.md) (Coming Soon)

### Technology Documentation
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Turborepo Documentation](https://turborepo.com/docs)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Three.js Documentation](https://threejs.org/docs)

---

<p align="center">
  <strong>Built with TypeScript, NestJS, Next.js, and AI</strong>
</p>

<p align="center">
  <em>A portfolio project demonstrating full-stack development, AI integration, and graph algorithms</em>
</p>
