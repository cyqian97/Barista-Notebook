# Barista Notebook

A full-stack coffee brewing tracking application. Record and manage your coffee beans, brewing sessions, and parameters across different brewing methods.

## Features

- Manage coffee bean inventory with detailed metadata (origin, process, roast, variety, etc.)
- Record brew sessions with method-specific parameters
- Supports multiple brewing methods: Aeropress, Kalita, Espresso, and more
- Track grind size, water temperature, brew time, and tasting notes

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
│       ├── AddBrew.js            # Create new brew records
│       ├── Beans.js              # Coffee bean management
│       ├── Brews.js              # Brew history view
│       └── ReturnHomeButton.js   # Shared navigation component
└── flask-backend/                # Flask backend
    ├── Dockerfile
    ├── app.py                    # API routes and database models
    ├── init_db.py                # Database initialization script
    └── instance/
        └── coffee.db             # SQLite database
```

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, React Router            |
| Backend  | Flask, SQLAlchemy, Flask-CORS     |
| Database | SQLite                            |
| DevOps   | Docker, Docker Compose            |

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

**With Docker:**
```bash
docker compose down
rm flask-backend/instance/coffee.db
docker compose up --build
# in a separate terminal, once the backend container is running:
docker compose exec backend python init_db.py
```

**Without Docker (local Flask):**
```bash
cd flask-backend
python init_db.py
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

## API Endpoints

| Method | Endpoint                              | Description                        |
|--------|---------------------------------------|------------------------------------|
| GET    | `/coffee-beans/`                      | List all beans (sorted by recency) |
| POST   | `/coffee-beans/`                      | Add a new bean                     |
| DELETE | `/coffee-beans/<id>`                  | Delete a bean                      |
| GET    | `/brews/`                             | List all brew records              |
| POST   | `/brews/`                             | Add a new brew                     |
| GET    | `/grinders/`                          | List all grinders                  |
| GET    | `/brewing-methods/`                   | List all brewing methods           |
| GET    | `/brewing-methods/<id>/parameters/`   | Get parameters for a method        |

## Database Models

- **CoffeeBean** — Bean metadata: name, country, process, roast, region, farm, variety, roaster, harvest info, notes
- **Brew** — Brew session: links to bean, grinder, and method; stores grind size, date, and tasting notes
- **BrewParameter** — Key-value parameters per brew (e.g., water temperature, brew time)
- **BrewingMethod** — Supported brewing methods
- **MethodParameterTemplate** — Parameter definitions per brewing method
- **Grinder** — Grinder equipment registry