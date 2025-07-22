# Dooor Product Maturity Dashboard - Codebase Information

## 📋 Project Overview
This is a **Next.js** React dashboard for tracking product maturity across different development stages (V1-V5). The dashboard provides real-time visualization of products as they progress through various maturity stages, from demo/concept to full production.

## 🏗️ Architecture & Tech Stack
- **Framework**: Next.js 15.4.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Data Source**: Currently uses mock data (no backend integration yet)

## 🎯 Product Maturity Model (V1-V5)

### Stage Definitions:
1. **V1 - Demo/Conceito** (Amber) - Initial concept and demo stage
2. **V2 - Protótipo** (Blue) - Prototype development
3. **V3 - Alpha/Beta** (Purple) - Testing with limited users
4. **V4 - Pre-Production** (Cyan) - Pre-production ready
5. **V5 - Produção** (Green) - Full production deployment

### Product Status Types:
- **Ready** ✅ - Product meets criteria to advance to next stage
- **Blocked** ❌ - Product has blockers preventing advancement
- **In Progress** ⏳ - Product is actively being developed

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with global styles
│   ├── page.tsx                 # Home page (renders main dashboard)
│   └── globals.css              # Global CSS styles
├── components/                   # React components
│   ├── ProductMaturityDashboard.tsx  # Main dashboard component
│   ├── dashboard-header.tsx     # Top header with controls
│   ├── product-card.tsx         # Individual product cards
│   ├── stage-column.tsx         # Column for each maturity stage
│   ├── stats-overview.tsx       # Overview statistics
│   └── ui/                      # shadcn/ui base components
│       ├── badge.tsx
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts                 # Utility functions (tailwind-merge)
└── types/
    └── index.ts                 # TypeScript type definitions
```

## 🔧 Key Components

### ProductMaturityDashboard.tsx
- **Location**: `src/components/ProductMaturityDashboard.tsx:1`
- **Main dashboard component** that orchestrates the entire UI
- Contains **mock data** for 5 products: Kenna, Chorus, Duet, Cadence, n8n-content
- Manages state for expanded/collapsed stages and last updated time
- Auto-refreshes every minute

### Product Data Structure
Each product contains:
- **Basic Info**: id, name, description, stage, targetStage
- **Tracking**: daysInStage, status, readinessScore, kickoffDate
- **Criteria**: Object with boolean flags for exit criteria
- **Metrics**: Key performance indicators with targets
- **Blockers**: Array of current blocking issues
- **Actions**: nextAction string for what to do next
- **URL**: Optional deployed application URL

### Stage Management
- **Collapsible columns** - Users can expand/collapse individual stages
- **Color-coded** stages with distinct visual themes
- **Product count** display for each stage
- **Status summaries** when collapsed showing ready/blocked/active counts

## 📊 Current Mock Data Products

### 1. Kenna (Healthcare AI Platform)
- **Stage**: V2 → V3 (blocked)
- **URL**: https://kenna-front-2.vercel.app
- **Status**: Blocked by AI speaker identification system
- **Readiness**: 75%

### 2. Chorus (Collaboration Platform)
- **Stage**: V3 → V4 (ready)
- **URL**: https://chorus.dooor.ai
- **Status**: Ready to advance
- **Readiness**: 95%

### 3. Duet (AI Chat Platform)  
- **Stage**: V3 → V3 (in-progress)
- **URL**: https://chat-a.dooor.ai
- **Status**: Recently started, fixing P2 issues
- **Readiness**: 90%

### 4. Cadence (Product Suite)
- **Stage**: V1 → V2 (in-progress)
- **URL**: None yet
- **Status**: Completing UI standardization
- **Readiness**: 60%

### 5. n8n-content (Content Management)
- **Stage**: V1 → V2 (in-progress) 
- **URL**: None yet
- **Status**: Gathering user feedback
- **Readiness**: 70%

## 🚀 Development & Deployment

### Available Scripts:
```bash
npm run dev        # Development server (with Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint checking
```

### Key Features:
- **Responsive design** - Works on desktop and mobile
- **Real-time updates** - Auto-refreshes every minute
- **Interactive UI** - Expand/collapse stages, filter controls
- **Progress tracking** - Visual progress bars and status indicators
- **Detailed metrics** - Exit criteria, blockers, and next actions

## 🔗 Backend Integration (Future)
Currently uses mock data embedded in `ProductMaturityDashboard.tsx:21-154`. The application is designed to integrate with a backend API that should provide:

- **GET /products** - List all products with their current status
- **PUT /products/:id** - Update product information
- **GET /products/:id/metrics** - Get detailed metrics for a product
- **POST /products** - Create new product entries

The `Product` interface in `src/types/index.ts:1-16` defines the expected data structure for backend integration.

## 🎨 UI/UX Details
- **Color-coded stages** with distinct visual themes
- **Status indicators** with appropriate colors (green=ready, red=blocked, yellow=in-progress)
- **Compact cards** showing essential info with expandable details
- **Statistics overview** showing totals and averages
- **Responsive grid layout** that adapts to screen size
- **Smooth animations** and transitions throughout

## 📝 Development Notes
- Uses client-side rendering (`'use client'` directive)
- No external API calls - all data is mocked
- TypeScript strict mode enabled
- Tailwind CSS with custom color palette
- Component-based architecture following React best practices
- Ready for backend integration when API becomes available