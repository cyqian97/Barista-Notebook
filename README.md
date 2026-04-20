# Barista Notebook

A full-stack coffee brewing tracking application. Record and manage your coffee beans, brewing sessions, and parameters across different brewing methods.

## Features

- Manage coffee bean inventory with detailed metadata (origin, process, roast, variety, etc.)
- Record brew sessions with method-specific parameters
- Supports multiple brewing methods: Aeropress, Kalita, Espresso, and more; create new methods on the fly
- Three-tier parameter system: common (all brews), method (per brewing method), and brew record (per individual brew)
- Track grind size, coffee dose, water temperature, brew time, tasting notes, and any custom fields
- Edit or delete existing brew records
- Quick-brew or view brews for a specific bean directly from the beans table
- Filter brew history by bean and method (multi-select)
- Manage grinders, brewing methods, method parameters, and common parameters from the Equipment page

## Project Structure

```
Barista-Notebook/
├── docker-compose.yml
├── barista-app/                  # React frontend
│   ├── Dockerfile
│   ├── .env.development          # Backend URL for local dev
│   ├── .env.production           # Backend URL for production
│   └── src/
│       ├── index.js              # App entry point and routes
│       ├── config.js             # API base URL configuration
│       ├── AddBrew.js            # Create and edit brew records
│       ├── Beans.js              # Coffee bean management
│       ├── Brews.js              # Brew history view
│       ├── Equipment.js          # Manage grinders, methods, and parameters
│       └── ReturnHomeButton.js   # Shared navigation component
└── flask-backend/                # Flask backend
    ├── Dockerfile
    ├── app.py                    # API routes and database models
    ├── init_db.py                # Database initialization script
    └── instance/
        └── coffee.db             # SQLite database
```

## Tech Stack

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Frontend | React 19, React Router                        |
| Backend  | Flask, SQLAlchemy, Flask-Migrate, Flask-CORS  |
| Database | SQLite                                        |
| DevOps   | Docker, Docker Compose                        |

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Run with Docker

```bash
docker-compose build
docker-compose up
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Initialize the Database

On first run, or to reset the database with sample data (grinders, brewing methods, parameter templates, and sample beans):

```bash
docker compose down
rm flask-backend/instance/coffee.db
docker compose up --build
# in a separate terminal, once the backend container is running:
docker compose exec backend python init_db.py
```

### Database Migrations

Flask-Migrate is set up for schema changes. After modifying a model in `app.py`:

```bash
docker compose exec backend flask db migrate -m "describe your change"
docker compose exec backend flask db upgrade
```

One-time setup (if the `migrations/` folder doesn't exist yet):

```bash
docker compose exec backend flask db init
docker compose exec backend flask db migrate -m "initial"
docker compose exec backend flask db stamp head
```

## Development

### Frontend (barista-app/)

```bash
cd barista-app
npm install --legacy-peer-deps
npm start        # Dev server on port 3000
npm test         # Run tests
npm run build    # Production build
```

> **Note:** Always use `--legacy-peer-deps` when installing packages due to React 19 compatibility.

### Backend (flask-backend/)

```bash
cd flask-backend
python init_db.py   # Initialize or reset database
python app.py       # Run Flask dev server on port 5000
```

### Adding New npm Packages

After adding a new frontend package, rebuild the Docker image:

```bash
docker compose down
rm -rf barista-app/node_modules
docker compose build --no-cache
docker compose up
```

## Parameter System

Brew parameters are organized into three tiers:

| Type | Scope | Managed in |
|------|-------|------------|
| **Common** | Every brew | Equipment page → Common Parameters |
| **Method** | Brews using a specific method | Equipment page → Brewing Methods |
| **Brew Record** | A single individual brew | Add Brew form |

Common and method parameters are defined as templates and shown as pre-filled fields when recording a brew. Brew record parameters are ad-hoc key-value fields added per brew and are not saved back to any template.

## API Endpoints

| Method | Endpoint                              | Description                          |
|--------|---------------------------------------|--------------------------------------|
| GET    | `/coffee-beans/`                      | List all beans (sorted by recency)   |
| POST   | `/coffee-beans/`                      | Add a new bean                       |
| DELETE | `/coffee-beans/<id>`                  | Delete a bean                        |
| GET    | `/brews/`                             | List all brew records                |
| POST   | `/brews/`                             | Add a new brew                       |
| GET    | `/brews/<id>`                         | Get a single brew                    |
| PUT    | `/brews/<id>`                         | Update a brew                        |
| DELETE | `/brews/<id>`                         | Delete a brew                        |
| GET    | `/grinders/`                          | List all grinders                    |
| POST   | `/grinders/`                          | Add a grinder                        |
| DELETE | `/grinders/<id>`                      | Delete a grinder                     |
| GET    | `/brewing-methods/`                   | List all brewing methods             |
| POST   | `/brewing-methods/`                   | Create a new brewing method          |
| DELETE | `/brewing-methods/<id>`               | Delete a brewing method              |
| GET    | `/brewing-methods/<id>/parameters/`   | Get method parameter templates       |
| POST   | `/brewing-methods/<id>/parameters/`   | Add a method parameter template      |
| DELETE | `/brewing-methods/<id>/parameters/<id>` | Delete a method parameter template |
| GET    | `/common-parameters/`                 | List common parameter templates      |
| POST   | `/common-parameters/`                 | Add a common parameter template      |
| DELETE | `/common-parameters/<id>`             | Delete a common parameter template   |

## Database Models

- **CoffeeBean** — Bean metadata: name, country, process, roast, region, farm, variety, roaster, harvest info, notes
- **Brew** — Brew session: links to bean, grinder, and method; stores grind size, date, and tasting notes
- **BrewParameter** — Key-value parameters per brew (water temperature, brew time, brew record params, etc.)
- **BrewingMethod** — Supported brewing methods
- **MethodParameterTemplate** — Parameter definitions per brewing method
- **CommonParameterTemplate** — Parameter definitions shown for every brew regardless of method
- **Grinder** — Grinder equipment registry
