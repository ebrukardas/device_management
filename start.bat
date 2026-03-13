@echo off
echo Starting PostgreSQL database using Docker Compose...
docker-compose up -d

echo.
echo Starting Backend API Server...
cd backend
start "Backend Server" cmd /k "npm start"
cd ..

echo.
echo Starting Frontend React App...
start "Frontend App" cmd /k "npm run dev"

echo.
echo All services have been started! The backend and frontend will open in their own separate windows.
