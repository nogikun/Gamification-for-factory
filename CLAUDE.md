# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a gamification system for factory workers consisting of multiple integrated applications:

1. **Mobile App** (dev/app/): Ionic React app for worker interactions
2. **Web Dashboard** (dev/server/frontend/): React admin interface for companies
3. **Backend API** (dev/server/backend/api/): FastAPI Python backend
4. **Game Component** (game/game.tiiki/): Separate React game interface
5. **Database**: PostgreSQL with Docker setup

## Development Commands

### Mobile App (dev/app/)
```bash
cd dev/app
npm run dev          # Start development server (Vite)
npm run build        # Build for production (TypeScript compilation + Vite build)
npm run lint         # Run ESLint
npm run test.unit    # Run Vitest unit tests
npm run test.e2e     # Run Cypress e2e tests
npm run storybook    # Start Storybook dev server on port 6006
```

### Web Dashboard (dev/server/frontend/)
```bash
cd dev/server/frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend API (dev/server/backend/api/)
```bash
cd dev/server/backend/api
# Using uv/rye (recommended):
uv run python main.py

# Traditional approach:
pip install -r requirements.lock
python main.py
```

### Full Stack Development (dev/server/)
```bash
cd dev/server
docker-compose up    # Start all services (API, DB, Frontend, Adminer)
```
- API: http://localhost:3000
- Frontend: http://localhost:5173  
- Database: localhost:5432
- Adminer (DB admin): http://localhost:5050

### Game Component (game/game.tiiki/)
```bash
cd game/game.tiiki
npm run dev          # Start development server
npm run build        # Build for production
```

### Android Build
```bash
# From project root:
./build_android.sh   # Linux/Mac
build_android.bat    # Windows
```

## Architecture Overview

### State Management
- **Mobile App**: Redux Toolkit with slices for:
  - `menuSlice`: Navigation state
  - `searchDateSlice`: Date filtering
  - `searchEventSlice`: Event search
  - `themeSlice`: UI theme management
  - `serverSlice`: Server configuration
  - `ngrokAuthSlice`: Development tunneling auth

### Database Schema
Key models (dev/server/backend/api/src/models.py):
- `Event`: Job events/internships with company info
- `Application`: User applications to events
- `Applicant`: Worker profiles
- `User`: Base user model
- `Review`: Performance reviews
- `Participant`: Event participation tracking

### API Structure
- **FastAPI backend** with SQLAlchemy ORM
- **PostgreSQL** database with schema migrations
- **Docker containerization** for all services

### Frontend Architecture
- **Mobile**: Ionic React with Capacitor for native features
- **Dashboard**: React with SCSS modules and Framer Motion
- **Game**: Standalone React app with custom game state management

## Development Setup Notes

### Mobile App Specifics
- Uses **Capacitor** for native mobile deployment
- **Storybook** integration for component development
- **Redux DevTools** integration available
- **Cypress** for e2e testing, **Vitest** for unit tests

### Backend Specifics  
- **FastAPI** with automatic OpenAPI documentation
- Database models use **SQLAlchemy** with UUID primary keys
- **Pydantic** schemas for API validation
- **Docker** multi-service setup with health checks

### Special Features
- **ngrok integration** for development tunneling (mobile app to local backend)
- **Adminer** database administration interface
- **Storybook** component library documentation
- **Multi-platform** build support (iOS/Android via Capacitor)

## Testing
- Mobile app: `npm run test.unit` (Vitest) and `npm run test.e2e` (Cypress)
- Backend: Implement pytest tests in backend/api/ directory
- Integration testing via Docker Compose stack

## Build & Deployment
- Mobile: Use Capacitor CLI for iOS/Android builds
- Web: Standard Vite/React builds with Docker containerization
- Backend: Docker-based deployment with PostgreSQL

## Important Development Guidelines

### Build and Package Management
**NEVER run build or npm/package management commands** (npm install, npm run build, npm run dev, etc.) without explicit user permission. These operations should be delegated to the user to avoid environment conflicts or unwanted changes.

### Game Integration
The game component from `game/game.tiiki/` has been integrated into the mobile app's Tab2 page:

- **Game files location**: `dev/app/src/components/Game/`
- **Game assets**: `dev/app/public/image/` and `dev/app/public/QUIZ.txt`, `dev/app/public/adjustment.txt`
- **Integration point**: Tab2.tsx imports and renders GameApp component
- **TypeScript configuration**: Modified to allow JavaScript files (`"allowJs": true`)

### Game Component Structure
- **GameApp.jsx**: Main game wrapper component (replaces original App.jsx)
- **Game state management**: Uses `useGameState` hook for centralized state
- **Screen navigation**: Single-screen app with `currentScreen` state control
- **Asset paths**: All game images accessible via `/image/` public path

### File Modifications Made
1. `dev/app/src/pages/Tab2.tsx`: Replaced content with GameApp component
2. `dev/app/tsconfig.json`: Set `"allowJs": true` to allow JSX files
3. `dev/app/package.json`: Simplified build script to `"vite build"` only
4. Created `dev/app/src/components/Game/GameApp.jsx`: Game wrapper component
5. Copied game source files and assets to appropriate locations
6. `dev/app/src/components/Game/GameApp.css`: Scoped all global styles to `.GameApp` container to prevent interference with other components (button, img, *, etc.)

### UI Design Constraints
- **Tab1 UI must remain unchanged** - do not modify Tab1's appearance or functionality
- Other tab UIs should be preserved unless explicitly requested to change