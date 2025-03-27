# FPL Basket Server

Backend API server for FPL Basket that interfaces with the Fantasy Premier League API and provides processed data to the frontend.

## Architecture

The server is built using Express.js with TypeScript and provides several API endpoints that fetch, process, and cache data from the official Fantasy Premier League API.

## API Endpoints

- `/api/data` - Basic FPL data
- `/api/league` - League data with manager performance
- `/api/live` - Live gameweek statistics

## Technologies

- Node.js
- Express
- TypeScript
- Axios for HTTP requests
- dotenv for environment configuration

## Development

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
# Create a .env file with the following variables
PORT=3001
# Add other environment variables as needed
```

3. Run development server:

```bash
pnpm dev
```

The server will be available at http://localhost:3001 (or the port specified in your `.env` file).

### Build

To build the production version:

```bash
pnpm build
```

This compiles TypeScript to JavaScript in the `dist` directory.

## Docker

The application includes a Dockerfile for containerization:

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm devjs` - Start development server using compiled JavaScript
- `pnpm debug` - Start server in debug mode
- `pnpm build` - Build for production

## API Usage Notes

The server acts as a proxy to the official FPL API, adding functionality such as:

1. Comparing data across gameweeks
2. Aggregating team and player statistics
3. Processing live updates during gameweeks
4. Caching data to reduce load on the FPL servers

All requests to the FPL API are made from the server to avoid CORS issues and to implement proper rate limiting.
