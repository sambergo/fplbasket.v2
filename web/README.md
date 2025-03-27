# FPL Basket Web

Frontend React application for FPL Basket that provides a modern UI for analyzing Fantasy Premier League data.

## Features

- Clean, responsive Material-UI interface
- League analysis dashboard
- Player performance comparisons
- Live gameweek tracking
- League standings visualization

## Technologies

- React 19
- TypeScript
- Material-UI 5
- React Router 7
- Axios for API requests
- Vite for build tooling

## Development

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Run development server:
```bash
pnpm dev
```

The development server will be available at http://localhost:5173 with hot module replacement.

### Build

To build the production version:

```bash
pnpm build
```

This creates optimized static files in the `dist` directory.

## Structure

- `src/` - Source code
  - `components/` - Reusable UI components
  - `state/` - Application state management
  - `types/` - TypeScript type definitions
  - `App.tsx` - Main application component
  - `Landing.tsx` - Landing page component
  - `League.tsx` - League display component
  - `service.ts` - API service functions
  - `tools.ts` - Utility functions

## Deployment

The build output is designed to be served as static files from any web server or CDN.

## Environment Configuration

The application expects the backend API to be available. By default, it connects to the local development server. For production, update the service URLs in `service.ts`.

## Design Principles

- Modern React patterns with functional components and hooks
- TypeScript for type safety
- Material-UI for consistent, responsive design
- Component-based architecture for maintainability
- Client-side routing with React Router
