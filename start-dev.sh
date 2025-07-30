#!/bin/bash

# Start development environment for Attribution Guard

echo "🚀 Starting Attribution Guard Development Environment..."

# Start backend server in background
echo "📡 Starting backend API server..."
cd server && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend dev server
echo "🌐 Starting frontend development server..."
cd ..
npm run dev

# Clean up background process on exit
trap "kill $BACKEND_PID" EXIT
