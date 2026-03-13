# 🏠 Smart Home Device Management System

This is a full-stack web application for managing smart home devices. It includes a React frontend (built with Vite), a Node.js/Express backend API, and a PostgreSQL database running in Docker.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/)** (v18 or higher recommended) - for running the frontend and backend.
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** - for running the PostgreSQL database container.
- **Git** (optional, for cloning).

## 📥 Installation & Setup

You can start the entire application using the provided batch script (Windows only) or run each service manually.

### Option 1: Quick Start (Windows Only)
The easiest way to start everything is to run the provided batch file from the root directory:
```batch
start.bat
```
This script will:
1. Start the PostgreSQL database via Docker.
2. Open a new window and start the backend Express server.
3. Open a new window and start the frontend React app.

### Option 2: Manual Setup

#### 1. Database (Docker)
The database is containerized using Docker Compose. The `docker-compose.yml` file is configured to use the official PostgreSQL 15 image.

To start the database:
```bash
# From the root directory of the project
docker-compose up -d
```
**How it works:**
- Docker pulls the PostgreSQL image and starts a container on port `5432`.
- It dynamically maps the volume to persist data.
- **Auto-Initialization:** It maps `./init.sql` to `/docker-entrypoint-initdb.d/init.sql` inside the container. When the database starts for the first time, this script runs automatically to create the `devices` table and populate it with sample data.

#### 2. Backend Setup
The backend is a Node.js Express server that connects to the PostgreSQL database and serves a REST API.

```bash
# Navigate to the backend directory
cd backend

# Install backend dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
```

**Connection Details:**
The backend connects to the database using the `pg` package. It uses the default credentials defined in `server.js` (which match the `docker-compose.yml`):
- Host: `localhost`
- User: `postgres`
- Password: `password123`
- Database: `devices_db`
- Port: `5432`

#### 3. Frontend Setup
The frontend is built with React and Vite. It uses `react-router-dom` for navigation and `lucide-react` for icons.

```bash
# Open a new terminal from the root directory
# Install frontend dependencies
npm install

# Start the React app (typically runs on http://localhost:5173)
npm run dev
```

## 🔌 Architecture & Connection

- **Frontend <-> Backend:** The React application runs locally and makes HTTP requests to the backend API (`http://localhost:5000/api/devices`). 
- **Backend <-> Database:** The Express server uses connection pooling (`pg.Pool`) to talk to the PostgreSQL database on port `5432`.

## 🗄️ Database Management

- **Creation:** The database (`devices_db`) and user are created automatically by Docker Compose using environment variables (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`).
- **Table Schema:** The `devices` table is created via the `init.sql` script containing fields: `id`, `name`, `type`, `status`, `added_at`, `last_connected_at`.
- **Updates:** The backend exposes standard REST endpoints (GET, POST, PUT, DELETE) which perform SQL queries to read, insert, update, and delete device records.

## 🛠️ Technologies Used
- **Frontend:** React 19, Vite, React Router, Lucide React
- **Backend:** Node.js, Express, `pg` (node-postgres), CORS
- **Database:** PostgreSQL 15
- **Infrastructure:** Docker & Docker Compose
