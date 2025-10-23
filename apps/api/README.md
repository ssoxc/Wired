# 🧠 Wired API — Neural Knowledge Graph Engine

> A self-organizing knowledge graph system that uses AI embeddings and graph algorithms to automatically discover semantic connections between ideas, simulating memory dynamics through temperature-based relevance scoring.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Core Concept](#-core-concept)
- [Architecture](#-architecture)
- [Data Model](#-data-model)
- [AI-Driven Connection Engine](#-ai-driven-connection-engine)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Environment Configuration](#-environment-configuration)
- [Key Features](#-key-features)
- [Algorithm Deep Dive](#-algorithm-deep-dive)
- [Future Roadmap](#-future-roadmap)

---

## 🎯 Overview

**Wired API** is a NestJS-based backend for a 3D knowledge graph system that models semantic connections between thoughts, ideas, and memories.

The system implements:
- **Semantic Node Creation**: Transforms raw content into enriched graph nodes using OpenAI embeddings
- **Automatic Connection Discovery**: Uses vector similarity to find and classify relationships between nodes
- **Dynamic Relevance Scoring**: Implements a memory weight algorithm that adjusts node importance based on activity and recency
- **Temperature-Based Graph Management**: Simulates memory decay and reinforcement through type-specific lifetime windows
- **AI-Powered Classification**: Leverages GPT-4o-mini for content analysis, summarization, and relation typing

---

## 💡 Core Concept

**Wired** implements a dynamic knowledge graph where content items (nodes) autonomously form semantic connections based on meaning rather than explicit user-defined links.

### Key Mechanisms

- **Node System**: Content is stored as typed entities (thoughts, ideas, tasks, memories, etc.) with AI-generated metadata
- **Semantic Connections**: Embeddings-based similarity detection automatically creates directed edges between related nodes
- **Memory Weight Algorithm**: Dynamic relevance scoring adjusts based on connection activity, recency, and importance
- **Graph Temperature**: Type-specific temporal windows determine how far back the system searches for connections
- **Reinforcement Learning**: Highly similar nodes strengthen each other's memory weight and importance scores

### Design Inspiration

The system draws from several domains:
- **Neural Networks**: Connection reinforcement through repeated activation
- **Cognitive Science**: Memory decay curves and recency-based relevance
- **Graph Theory**: Directed edges with typed semantic relationships
- **Information Retrieval**: Vector embeddings for semantic similarity search

---

## 🏗️ Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│                   (Next.js + Three.js)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│                      NestJS API Layer                        │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  Controllers   │  │   Services   │  │   Repositories  │ │
│  └────────┬───────┘  └──────┬───────┘  └────────┬────────┘ │
│           │                  │                    │          │
│  ┌────────▼──────────────────▼────────────────────▼───────┐ │
│  │           Connection Engine Service                     │ │
│  │  • Candidate Selection    • Confidence Scoring         │ │
│  │  • Relation Classification • Reinforcement Learning    │ │
│  └────────┬────────────────────────────────────────────────┘ │
│           │                                                   │
│  ┌────────▼──────────────────────────────────────────────┐  │
│  │              OpenAI Service Layer                      │  │
│  │  • Embeddings (text-embedding-3-small)                │  │
│  │  • Completions (GPT-4o-mini)                          │  │
│  │  • Relation Summaries • Classification                │  │
│  └────────┬───────────────────────────────────────────────┘  │
└───────────┼──────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────┐
│             PostgreSQL + pgvector Extension                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Nodes     │  │ Connections  │  │   Metadata   │       │
│  │ (w/ vectors) │  │  (edges)     │  │ (visual/UX)  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

### Module Structure

```
apps/api/src/
├── entities/              # TypeORM Entity Definitions
│   ├── Node.ts           # Core thought/memory entity
│   ├── NodeConnection.ts # Semantic relationships (edges)
│   ├── NodeContent.ts    # Actual content + media
│   ├── NodeMetadata.ts   # UI/visualization metadata
│   ├── NodeInteraction.ts# User engagement tracking
│   └── User.ts           # User entity
│
├── enums/                # Type Definitions
│   ├── NodeType.ts       # thought, memory, task, idea, etc.
│   ├── NodeRelationType.ts # inspired_by, contradicts, etc.
│   ├── NodeSources.ts    # manual, spotify, notion, etc.
│   └── NodeMediaType.ts  # text, image, audio, video
│
├── connection-system/    # AI Connection Engine
│   ├── ConnectionEngineService.ts    # Core matching logic
│   ├── memory-weight.util.ts         # Temperature & decay
│   └── BASE_NODE_TYPE_LIFETIME.ts    # Type-based lifetimes
│
├── openai/               # AI Integration Layer
│   ├── OpenAiService.ts              # OpenAI wrapper
│   ├── guards/                       # Validation guards
│   ├── prompts/                      # Prompt templates
│   │   ├── CompletionPromptTemplates.ts
│   │   ├── RelationSummaryTemplate.ts
│   │   └── RelationTypeClassification.ts
│   └── schema/                       # JSON schemas
│
├── use-cases/            # Business Logic Layer
│   ├── node/             # Node operations
│   │   ├── node.controller.ts
│   │   ├── node.service.ts
│   │   └── node.module.ts
│   └── user/             # User management
│
├── types/                # TypeScript Interfaces
│   ├── dto/CreateNode.ts
│   ├── IOpenAiCompletion.ts
│   └── IPosition.ts
│
├── app.module.ts         # Root application module
└── main.ts               # Application entry point
```

---

## 📊 Data Model

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1:N
       │
┌──────▼──────────────────────────────────────────┐
│                   Node                           │
├──────────────────────────────────────────────────┤
│ id: UUID                                         │
│ title: string                                    │
│ summary: text                                    │
│ type: NodeType (enum)                            │
│ embeddings: vector(1536)  ◄── AI Generated      │
│ importance: float (0-1)                          │
│ sentiment: float (-1 to 1)                       │
│ memoryWeight: float (0-1) ◄── Dynamic Score      │
│ createdAt: timestamp                             │
├──────────────────────────────────────────────────┤
│ Computed Properties:                             │
│ • connectionCount                                │
│ • avgConnectionConfidence                        │
│ • lastConnectedAt                                │
└───┬────────────────────────────────────┬─────────┘
    │ 1:N                                │ 1:1
    │                                    │
┌───▼──────────────┐          ┌─────────▼──────────┐
│  NodeContent     │          │   NodeMetadata     │
├──────────────────┤          ├────────────────────┤
│ text: string     │          │ tags: string[]     │
│ data: json       │          │ source: enum       │
│ media: NodeMedia │          │ color: string      │
└──────────────────┘          │ position: Vec3     │
                              │ lastSyncedAt: date │
                              └────────────────────┘
┌───────────────────────────────────────────────────┐
│              NodeConnection                       │
├───────────────────────────────────────────────────┤
│ id: UUID                                          │
│ sourceNodeId: UUID (FK → Node)                    │
│ targetNodeId: UUID (FK → Node)                    │
│ relation_type: NodeRelationType (enum)            │
│ confidence: float (0-1)                           │
│ summary: text  ◄── AI Generated                   │
│ createdAt: timestamp                              │
└───────────────────────────────────────────────────┘
```

### Node Types

The system supports 11 distinct node types, each with unique temporal characteristics:

| Type           | Description                        | Base Lifetime (days) |
|----------------|------------------------------------|--------------------|
| `emotion`      | Fleeting emotional states          | 3                  |
| `thought`      | Quick ideas, observations          | 5                  |
| `idea`         | Creative concepts                  | 7                  |
| `task`         | Action items, todos                | 10                 |
| `event`        | Calendar events, moments           | 14                 |
| `habit`        | Behavioral patterns                | 30                 |
| `topic`        | Subject areas, domains             | 30                 |
| `memory`       | Important recollections            | 60                 |
| `goal`         | Long-term objectives               | 90                 |
| `relationship` | Personal connections               | 90                 |
| `person`       | People in your life                | 90                 |

### Relation Types

Connections between nodes are classified into semantic categories:

| Relation Type      | Description                                    | Direction |
|-------------------|------------------------------------------------|-----------|
| `caused_by`       | Causal relationship (A caused B)               | →         |
| `inspired_by`     | Creative inspiration                           | →         |
| `contradicts`     | Opposing or conflicting ideas                  | ↔         |
| `similar_to`      | Semantic similarity                            | ↔         |
| `continues_from`  | Sequential continuation                        | →         |
| `depends_on`      | Dependency relationship                        | →         |
| `associated_with` | Loose association                              | ↔         |
| `reflects_on`     | Meta-cognitive reflection                      | →         |

---

## 🤖 AI-Driven Connection Engine

The **ConnectionEngineService** automatically discovers and creates semantic connections between nodes using vector similarity and AI classification.

### Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                    Node Creation Event                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  1. Generate Embeddings     │
        │     (OpenAI API)            │
        │  • text-embedding-3-small   │
        │  • 1536-dimensional vector  │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  2. Generate Completion     │
        │     (GPT-4o-mini)           │
        │  • Title (≤5 words)         │
        │  • Summary (1 sentence)     │
        │  • Sentiment (-1 to 1)      │
        │  • Importance (0 to 1)      │
        │  • Type classification      │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  3. Save Node to DB         │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  4. Connection Engine       │
        │     Processing              │
        └──────────────┬──────────────┘
                       │
        ┌──────────────▼──────────────────────┐
        │  4a. Get Candidates                 │
        │  • Calculate recency cutoff         │
        │  • Query by vector similarity       │
        │  • Filter by graph temperature      │
        │  • Return top 20 matches            │
        └──────────────┬──────────────────────┘
                       │
        ┌──────────────▼──────────────────────┐
        │  4b. Evaluate Connections           │
        │  For each candidate:                │
        │  • Compute cosine similarity        │
        │  • Calculate confidence score       │
        │  • Generate relation summary (AI)   │
        │  • Classify relation type (AI)      │
        │  • Create NodeConnection entity     │
        └──────────────┬──────────────────────┘
                       │
        ┌──────────────▼──────────────────────┐
        │  4c. Reinforcement                  │
        │  If similarity ≥ 0.65 & same type:  │
        │  • Boost memoryWeight               │
        │  • Increase importance              │
        │  • Save updated nodes               │
        └─────────────────────────────────────┘
```

### Candidate Selection Algorithm

The system uses **graph temperature** to determine how far back in time to search for related nodes:

```typescript
function getRecentCutoff(node: Node) {
  // Base lifetime by node type (e.g., 7 days for ideas, 90 for goals)
  const baseWindow = BASE_NODE_TYPE_LIFETIME[node.type];
  
  // Boost based on connection activity
  const activityBoost = min(
    (connectionCount / 10) * avgConnectionConfidence,
    2
  );
  
  // Decay based on time since last connection
  const timeSinceLast = daysSince(node.lastConnectedAt);
  const decayFactor = max(0.3, 1 - timeSinceLast / baseWindow);
  
  // Temperature = combined metric of "aliveness"
  const temperature = min(1, 
    (activityBoost * decayFactor + importance) / 3
  );
  
  // Extend search window based on temperature
  const adjustedWindowDays = baseWindow * (1 + temperature * 1.5);
  
  return new Date(now - adjustedWindowDays * MS_PER_DAY);
}
```

Active nodes with high importance and recent connections maintain extended temporal search windows, allowing them to connect with older content. Inactive nodes have shorter windows and only connect with recent matches.

### Connection Confidence Scoring

```typescript
// Cosine similarity between embedding vectors
const similarity = cosineSimilarity(
  newNode.embeddings, 
  candidate.embeddings
);

// Only create connections above threshold
if (similarity < 0.65) continue;

// Confidence = similarity score
const confidence = similarity;
```

### Reinforcement Learning

When two nodes of the same type are highly similar (≥0.65), they reinforce each other:

```typescript
const reinforcement = min(1, similarity * 0.1);

node.memoryWeight = min(1, node.memoryWeight + reinforcement);
node.importance = min(1, node.importance + reinforcement * 0.5);
```

This implements a Hebbian-like learning pattern where frequently connected nodes strengthen each other's relevance.

---

## 🛠️ Technology Stack

### Core Framework
- **NestJS 11** - Scalable Node.js framework with TypeScript
- **TypeORM 0.3** - Object-relational mapper with PostgreSQL support
- **Node.js** - JavaScript runtime

### Database
- **PostgreSQL** - Relational database
- **pgvector** - Vector similarity search extension
  - Enables `<=>` (cosine distance) operator
  - Optimized for 1536-dimensional embeddings

### AI/ML Services
- **OpenAI API**
  - `text-embedding-3-small` - Embedding generation (1536D)
  - `gpt-4o-mini` - Completions, summaries, classifications

### Development Tools
- **TypeScript 5.7** - Type-safe development
- **ESLint + Prettier** - Code quality
- **Jest** - Testing framework
- **SWC** - Fast TypeScript compilation

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL 14+ with **pgvector extension**
- OpenAI API Key

### Installation

```bash
# Clone repository
git clone <repository-url>
cd wired/apps/api

# Install dependencies
yarn install
# or
npm install
```

### Database Setup

```sql
-- Connect to your PostgreSQL instance
psql -U postgres

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- TypeORM will auto-create tables (synchronize: true in dev)
```

### Environment Configuration

Create a `.env` file in `apps/api/`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/wired

# OpenAI
OPENAI_KEY=sk-proj-...

# Application
PORT=3000
NODE_ENV=development
```

### Running the Application

```bash
# Development mode (watch mode)
yarn dev

# Production build
yarn build
yarn start:prod

# Debug mode
yarn start:debug
```

The API will be available at `http://localhost:3000`

---

## 📡 API Endpoints

### Node Operations

#### Create Node
```http
POST /node
Content-Type: application/json

{
  "content": [
    {
      "text": "I should build an AI system that connects my notes automatically",
      "data": null,
      "media": null
    }
  ],
  "metadata": {
    "tags": ["ai", "productivity"],
    "source": "manual",
    "color": "#4A90E2"
  }
}
```

**Response**: Full `Node` object with AI-generated fields

**Process**:
1. Generates 1536D embedding vector
2. Creates title, summary, sentiment, importance via GPT-4o-mini
3. Saves to database
4. Asynchronously runs Connection Engine
5. Returns node immediately (connections processed in background)

---

#### Get User Nodes
```http
GET /node/user/:userId
```

**Response**: Array of all nodes for user

---

#### Get Similar Nodes
```http
GET /node/similar/:nodeId
```

**Response**: Top 5 most similar nodes by vector distance

**Uses**: PostgreSQL pgvector `<=>` operator for efficient similarity search

---

#### Create Raw Node (Testing)
```http
POST /node/raw
Content-Type: application/json

{
  "id": "uuid",
  "title": "Test Node",
  "summary": "...",
  "embeddings": [...],
  // ... full node structure
}
```

**Note**: Bypasses AI processing, for testing/seeding

---

#### Bulk Create Raw Nodes
```http
POST /node/raw/many
Content-Type: application/json

{
  "nodes": [
    { /* node 1 */ },
    { /* node 2 */ }
  ]
}
```

---

## ⚙️ Environment Configuration

### Required Variables

| Variable       | Description                              | Example                          |
|----------------|------------------------------------------|----------------------------------|
| `DATABASE_URL` | PostgreSQL connection string             | `postgresql://...`               |
| `OPENAI_KEY`   | OpenAI API key                           | `sk-proj-...`                    |
| `PORT`         | Application port (optional, default 3000)| `3000`                           |

### Database Configuration

The app uses TypeORM with these settings (see `app.module.ts`):

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,
  synchronize: true, // ⚠️ Disable in production!
  ssl: { rejectUnauthorized: false }, // For cloud databases
})
```

**Production Recommendation**: Set `synchronize: false` and use migrations.

---

## ✨ Key Features

### 1. **Automatic Semantic Linking**
- Nodes connect themselves based on meaning, not keywords
- AI analyzes context and generates human-readable relationship summaries

### 2. **Vector-Based Similarity**
- 1536-dimensional embeddings capture semantic content
- pgvector extension provides efficient similarity queries
- Cosine distance operator (`<=>`) for nearest-neighbor search

### 3. **Dynamic Memory Weight**
- Nodes have a "relevance score" that changes over time
- Factors: recency, connection activity, user interactions, importance
- Simulates human memory: active ideas stay warm, inactive ones fade

### 4. **Graph Temperature System**
- Type-based base lifetimes (emotions: 3 days, goals: 90 days)
- Activity boosts extend search windows based on connection count and confidence
- Decay factors reduce relevance over time since last connection
- Active nodes maintain longer temporal search ranges
- Inactive nodes have shorter connection windows

### 5. **Reinforcement Learning**
- Similar nodes of the same type strengthen each other
- Memory weight and importance increase proportionally
- Creates emergent "concept clusters" over time

### 6. **AI-Powered Content Analysis**
- **Structured Summarization**: Every node gets a concise title and summary
- **Sentiment Analysis**: Emotional tone detection (-1 to +1)
- **Importance Scoring**: AI evaluates significance (0 to 1)
- **Type Classification**: Automatic categorization into 11 types
- **Relation Classification**: 8 semantic relationship types

### 7. **Multi-Modal Content Support** (Planned)
- Text, images, audio, video
- Media stored as `NodeMedia` entities
- Extensible `NodeContent.data` field for rich metadata

### 8. **Source Tracking**
- Nodes can originate from multiple sources:
  - Manual entry
  - Spotify listening history
  - Notion pages
  - Calendar events
  - GitHub activity
  - AI-generated content

---

## 🧮 Algorithm Deep Dive

### Memory Weight Formula

```typescript
// Initial calculation factors
temperature = (activityBoost * decayFactor + importance) / 3

where:
  activityBoost = min((connectionCount / 10) * avgConfidence, 2)
  decayFactor = max(0.3, 1 - daysSinceLast / baseWindow)
  
// Window adjustment
adjustedWindow = baseWindow * (1 + temperature * 1.5)

// Reinforcement update
Δmemory = min(1, similarity * 0.1)
memoryWeight = min(1, memoryWeight + Δmemory)
```

### Example Scenario

**Node A**: `type: idea`, created 10 days ago
- `baseWindow = 7 days`
- `connectionCount = 3`
- `avgConfidence = 0.8`
- `importance = 0.9`
- `lastConnectedAt = 2 days ago`

**Calculation**:
```
activityBoost = min((3/10) * 0.8, 2) = 0.24
decayFactor = max(0.3, 1 - 2/7) = 0.71
temperature = (0.24 * 0.71 + 0.9) / 3 = 0.36
adjustedWindow = 7 * (1 + 0.36 * 1.5) = 10.78 days
```

**Result**: Node A can connect with nodes up to **~11 days old** instead of just 7.

---

### Cosine Similarity Implementation

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (normA * normB);
}
```

**Performance Note**: In production, this is offloaded to PostgreSQL's pgvector extension:

```sql
SELECT *, 1 - (embeddings <=> '[0.1, 0.2, ...]') AS similarity
FROM node
ORDER BY similarity DESC
LIMIT 20;
```

---

## 🔮 Future Roadmap

### Near-Term Enhancements

- [ ] **Real-time Graph Updates** via WebSockets
- [ ] **Clustering Algorithms** for concept group detection
- [ ] **User Interaction Tracking** (`NodeInteraction` entity)
- [ ] **Memory Decay Jobs** (scheduled pruning of low-weight nodes)
- [ ] **Advanced Search** (natural language queries)
- [ ] **Node Merging** (duplicate detection and consolidation)

### Mid-Term Goals

- [ ] **Multi-modal Embeddings** (CLIP for images, Whisper for audio)
- [ ] **Graph Analytics Dashboard** (centrality, communities, paths)
- [ ] **Collaborative Graphs** (shared knowledge spaces)
- [ ] **Custom Relation Types** (user-defined relationships)
- [ ] **Temporal Queries** ("show my focus last month")
- [ ] **Export/Import** (graph portability)

### Long-Term Vision

- [ ] **Reasoning Agent Layer** (LLM traverses graph to answer questions)
- [ ] **Auto-Insight Generation** ("you haven't thought about X in 3 months")
- [ ] **Concept Evolution Tracking** (how ideas change over time)
- [ ] **Cross-User Pattern Detection** (privacy-preserving collective intelligence)
- [ ] **3D Physics Simulation** (force-directed layout based on confidence)
- [ ] **Federated Learning** (privacy-first distributed embeddings)

---

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov

# Watch mode
yarn test:watch
```

---

## 📝 Contributing

### Development Workflow

1. **Clone and install**
   ```bash
   git clone <repo>
   cd wired/apps/api
   yarn install
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make changes** following TypeScript/NestJS best practices

4. **Run linter and formatter**
   ```bash
   yarn lint
   yarn format
   ```

5. **Test thoroughly**
   ```bash
   yarn test
   yarn test:e2e
   ```

6. **Submit PR** with detailed description

---

## 📄 License

[Insert License Here]

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and embedding models
- **pgvector** for making vector search in Postgres possible
- **NestJS** team for the excellent framework
- Inspired by research in cognitive science, neural networks, and knowledge graphs

---

## 📞 Contact

For questions or collaboration opportunities:
- **GitHub Issues**: [Link to issues]
- **Email**: [Your email]

---

## 🔬 Technical Notes

### Database Indexes

For optimal performance, consider these indexes:

```sql
-- Vector similarity index (IVFFlat or HNSW)
CREATE INDEX node_embeddings_idx ON node 
USING ivfflat (embeddings vector_cosine_ops)
WITH (lists = 100);

-- Common query patterns
CREATE INDEX idx_node_created_at ON node(created_at);
CREATE INDEX idx_node_type ON node(type);
CREATE INDEX idx_node_user_id ON node(user_id);
CREATE INDEX idx_connection_confidence ON node_connections(confidence);
```

### Scaling Considerations

**Current Capacity**: Optimized for 10K-100K nodes per user

**Bottlenecks**:
- OpenAI API rate limits (batch embeddings for better throughput)
- Vector similarity search (consider approximate nearest neighbor)
- Synchronous connection processing (move to queue system)

**Recommended Scaling Approach**:
1. **Queue System** (Bull/BullMQ) for connection processing
2. **Caching Layer** (Redis) for frequently accessed nodes
3. **Read Replicas** for query-heavy workloads
4. **Approximate Vector Search** (HNSW index) for large graphs

### AI Cost Optimization

**Current Usage per Node**:
- 1x embedding call (~$0.00002)
- 1x completion call (~$0.0001)
- Nx relation summaries (N = number of connections)
- Nx relation classifications

**Optimization Strategies**:
- Batch embed multiple nodes in single API call
- Cache embeddings for unchanged content
- Use GPT-3.5-turbo for relation summaries (cheaper)
- Implement similarity threshold to limit connection attempts

---

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [TypeORM Documentation](https://typeorm.io)

---

**Version**: 0.0.1  
**Last Updated**: October 2025  
**Status**: Active Development 🚧
