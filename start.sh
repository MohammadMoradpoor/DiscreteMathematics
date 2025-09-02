#!/bin/bash

echo "Starting Discrete Mathematics Application..."
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi

# Backend setup
echo -e "${YELLOW}Setting up backend...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Start backend server
echo -e "${GREEN}Starting backend server on http://localhost:5000${NC}"
python app.py &
BACKEND_PID=$!

# Frontend setup
cd ../frontend
echo -e "${YELLOW}Setting up frontend...${NC}"

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies (this may take a few minutes)..."
    npm install
fi

# Start frontend server
echo -e "${GREEN}Starting frontend server on http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Servers stopped successfully.${NC}"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Wait for user to stop the servers
echo -e "\n${GREEN}=========================================="
echo -e "Application is running!"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend API: http://localhost:5000"
echo -e "Press Ctrl+C to stop the servers"
echo -e "==========================================${NC}\n"

# Keep the script running
wait
