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
  - `/addbrew` - Create new brew records (AddBrew.js); also handles editing via `?edit=<id>`
  - `/brews` - View all brew history with edit/delete per card (Brews.js)
  - `/equipment` - Manage grinders, brewing methods, and parameter templates (Equipment.js)
- **API Configuration**: Backend URL configured in `.env.development` (localhost:5000) and `.env.production` files, accessed via `src/config.js`

### Backend (flask-backend/)
- **Framework**: Flask with SQLAlchemy ORM and Flask-Migrate
- **Database**: SQLite (coffee.db) with the following models:
  - `CoffeeBean` - Coffee bean metadata (name, country, process, roast, region, farm, variety, etc.)
  - `Brew` - Brew session records with foreign keys to CoffeeBean, Grinder, and BrewingMethod
  - `BrewParameter` - Key-value parameters for each brew (water temp, brew time, etc.)
  - `BrewingMethod` - Supported brewing methods (Aeropress, Kalita, Espresso, etc.)
  - `MethodParameterTemplate` - Parameter templates per brewing method; managed in Equipment page
  - `CommonParameterTemplate` - Parameter templates shown on every brew regardless of method; managed in Equipment page
  - `Grinder` - Grinder equipment registry
- **Key endpoints**:
  - `/coffee-beans/` - GET (list), POST (add)
  - `/coffee-beans/<id>` - DELETE
  - `/brews/` - GET (list), POST (add)
  - `/brews/<id>` - GET (single), PUT (update), DELETE
  - `/grinders/` - GET, POST
  - `/grinders/<id>` - DELETE
  - `/brewing-methods/` - GET, POST
  - `/brewing-methods/<id>` - DELETE
  - `/brewing-methods/<id>/parameters/` - GET, POST
  - `/brewing-methods/<id>/parameters/<id>` - DELETE
  - `/common-parameters/` - GET, POST
  - `/common-parameters/<id>` - DELETE

### Database Schema Changes
Flask-Migrate is configured. After modifying a model in `app.py`:
```bash
docker compose exec backend flask db migrate -m "describe change"
docker compose exec backend flask db upgrade
```

### Database Initialization
To reset and reseed with sample data:
```bash
docker compose down
rm flask-backend/instance/coffee.db
docker compose up --build
docker compose exec backend python init_db.py
```

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

## Key Implementation Details

### Frontend-Backend Communication
- All API URLs are centralized in `barista-app/src/config.js` using `REACT_APP_BACKEND_URL` environment variable
- Backend URL is set in `.env.development` for local dev and `.env.production` for production builds

### Three-Tier Brew Parameter System
Parameters are organized into three types, each with a different scope:

| Type | Scope | Template model | Managed in |
|------|-------|----------------|------------|
| **Common** | Every brew | `CommonParameterTemplate` | Equipment page |
| **Method** | Brews using a specific method | `MethodParameterTemplate` | Equipment page |
| **Brew Record** | A single individual brew | None (ad-hoc) | Add Brew form |

- Common and method parameters appear as pre-filled input fields when recording a brew.
- Brew record parameters are ad-hoc key-value fields added per brew; they are **never** auto-saved to any template.
- "Coffee Dose" is a hardcoded universal field on the Add Brew form — do not add it to any template.
- All parameter values are stored as `BrewParameter` rows regardless of type.

### Edit Brew Flow
- `/addbrew?edit=<id>` puts AddBrew into edit mode.
- On load, the brew is fetched and params are distributed across the three tiers by comparing against loaded templates.
- A `templatesLoaded` flag prevents the distribution effect from running before method templates finish loading (race condition guard).
- On submit, a PUT request is sent instead of POST. The form stays populated after saving (no reset).

### Coffee Bean Ordering
Coffee beans are ordered by `last_use_date` (descending, nulls last) in the `/coffee-beans/` endpoint.

## Environment Notes
- The project was originally developed using WSL with local npm installation
- Docker setup uses `node:22` for frontend and `python:3.10-slim` for backend
- Frontend requires `--legacy-peer-deps` flag for npm installs due to React 19 compatibility
