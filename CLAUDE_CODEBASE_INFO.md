# Dooor Product Maturity Dashboard - Codebase Information

## 📋 Project Overview
This is a **Next.js** React dashboard for tracking product maturity across different development stages (V1-V5). The dashboard provides real-time visualization of products as they progress through various maturity stages, from demo/concept to full production.

## 🏗️ Architecture & Tech Stack
- **Framework**: Next.js 15.4.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)
- **Data Source**: Python backend API integration via HTTP endpoints

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
- Fetches real-time data from Python backend API at `http://localhost:8000/maturity/products`
- Manages state for expanded/collapsed stages and last updated time
- Auto-refreshes every minute
- **Drag & Drop**: Products can be dragged between stages to update their maturity level

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

## 📊 Current Products (from Python Backend)

### Backend Products:
The dashboard dynamically loads products from the Python backend API. Current products include:

### 1. Chorus
- **URL**: https://chorus-staging.dooor.ai
- **Status**: Ready (100% readiness score)
- **Backend Data**: Fetched from `/maturity/products` endpoint

### 2. Cadence
- **URL**: https://cadence-staging.dooor.ai
- **Status**: Blocked (0% readiness score)

### 3. Kenna
- **URL**: https://kenna-staging.dooor.ai
- **Status**: Blocked (0% readiness score)

### 4. Duet
- **URL**: https://duet-staging.dooor.ai
- **Status**: Blocked (0% readiness score)

**Note**: All products are fetched with real-time data from the Python backend, with null-safe defaults applied for missing values.

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
- **Real-time updates** - Auto-refreshes every minute from Python backend
- **Interactive UI** - Expand/collapse stages, filter controls
- **Drag & Drop** - Move products between stages with visual feedback
- **Progress tracking** - Visual progress bars and status indicators
- **Detailed metrics** - Exit criteria, blockers, and next actions
- **CORS-enabled** - Properly configured for localhost development

## 🔗 Backend Integration (Active)
The application is fully integrated with a Python backend API running on `http://localhost:8000`. Current endpoints:

### API Endpoints:
- **GET /maturity/products** - Fetches all products with maturity data
- **PATCH /maturity/products/:id/stage** - Updates product stage via drag & drop
- **GET /maturity/products/:id** - Get individual product data (legacy support)

### Backend Response Format:
```json
{
  "products": [
    {
      "id": "chorus",
      "name": "chorus", 
      "stage": null,
      "status": "ready",
      "readinessScore": 100.0,
      "url": "https://chorus-staging.dooor.ai",
      "criteria": {"staging": true},
      "metrics": {},
      "blockers": [],
      "nextAction": null
    }
  ]
}
```

### Frontend Safety Features:
- **Null-safe defaults** applied to all backend data
- **Optimistic updates** for drag & drop operations
- **Error handling** with automatic data refresh on API failures
- **CORS configuration** for localhost development

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
- **Active backend integration** with Python API at localhost:8000
- **Drag & Drop functionality** implemented with native HTML5 DnD API
- TypeScript strict mode enabled
- Tailwind CSS with custom color palette
- Component-based architecture following React best practices
- **Production-ready** with full backend integration and error handling

## 🎯 Recent Updates
- ✅ **Backend Integration**: Replaced mock data with live Python API
- ✅ **Drag & Drop**: Added interactive stage movement functionality  
- ✅ **CORS Resolution**: Fixed cross-origin resource sharing issues
- ✅ **Error Handling**: Added comprehensive null-safe data processing
- ✅ **API Optimization**: Implemented optimistic updates and error recovery