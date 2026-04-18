# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Barista Notebook is a full-stack coffee brewing tracking application with a React frontend and Flask backend. It allows users to manage coffee beans, record brewing sessions with different methods (Aeropress, Kalita, Espresso, etc.), and track brewing parameters.

## Architecture

### Frontend (barista-app/)
- **Framework**: React 19 with React Router for navigation
- **Main Routes**:
  - `/` - Home page with navigation
  - `/beans` - Coffee bean management (Beans.js)
  - `/addbrew` - Create new brew records (AddBrew.js)
  - `/brews` - View all brew history (Brews.js)
- **API Configuration**: Backend URL configured in `.env.development` (localhost:5000) and `.env.production` files, accessed via `src/config.js`

### Backend (flask-backend/)
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: SQLite (coffee.db) with five main models:
  - `CoffeeBean` - Coffee bean metadata (name, country, process, roast, region, farm, variety, etc.)
  - `Brew` - Brew session records with foreign keys to CoffeeBean, Grinder, and BrewingMethod
  - `BrewParameter` - Dynamic key-value parameters for each brew (water temp, brew time, etc.)
  - `BrewingMethod` - Supported brewing methods (Aeropress, Kalita, Espresso, etc.)
  - `MethodParameterTemplate` - Parameter templates for each brewing method
  - `Grinder` - Grinder equipment used
- **Key endpoints**:
  - `/coffee-beans/` - GET (list) and POST (add)
  - `/coffee-beans/<id>` - DELETE
  - `/brews/` - GET (list) and POST (add)
  - `/grinders/` - GET
  - `/brewing-methods/` - GET
  - `/brewing-methods/<id>/parameters/` - GET method-specific parameter templates

### Database Initialization
Run `python flask-backend/init_db.py` to create tables and populate with sample data (grinders, brewing methods, parameter templates, and sample beans).

## Development Commands

### Running the Application with Docker
```bash
# Build and start both frontend and backend
docker-compose build
docker-compose up

# Rebuild with no cache (after adding npm packages)
docker compose down
rm -rf barista-app/node_modules
docker compose build --no-cache
docker compose up
```

The frontend runs on `localhost:3000`, backend on `localhost:5000`.

### Frontend Development (barista-app/)
```bash
cd barista-app
npm start                # Development server (port 3000)
npm test                 # Run tests in watch mode
npm run build            # Production build
```

**Important**: When adding new npm packages, always use `--legacy-peer-deps` flag and rebuild Docker images.

### Backend Development (flask-backend/)
```bash
cd flask-backend
python init_db.py        # Initialize/reset database with sample data
python app.py            # Run Flask dev server (port 5000)
```

### Testing
```bash
cd barista-app
npm test                 # Frontend tests
```

## Key Implementation Details

### Frontend-Backend Communication
- All API URLs are centralized in `barista-app/src/config.js` using `REACT_APP_BACKEND_URL` environment variable
- Backend URL is set in `.env.development` for local dev and `.env.production` for production builds

### Brew Parameter System
The application uses a flexible parameter system:
- Each brewing method has templates defined in `MethodParameterTemplate` (e.g., "Water Temperature", "Brew Time")
- When creating a brew, parameters are stored as key-value pairs in `BrewParameter` table
- This allows different methods to have different parameters without schema changes

### Coffee Bean Ordering
Coffee beans are ordered by `last_use_date` (descending, nulls last) in the `/coffee-beans/` endpoint, showing recently used beans first.

## Environment Notes
- The project was originally developed using WSL with local npm installation
- Docker setup uses `node:22` for frontend and `python:3.10-slim` for backend
- Frontend requires `--legacy-peer-deps` flag for npm installs due to React 19 compatibility
