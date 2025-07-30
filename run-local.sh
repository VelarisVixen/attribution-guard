#!/bin/bash

echo "🛡️ Starting Attribution Guard locally..."

# Check if backend is already running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend already running on port 3001"
else
    echo "🚀 Starting backend server..."
    cd server && npm start &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    # Wait for backend to start
    echo "⏳ Waiting for backend to start..."
    sleep 5
    
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend started successfully!"
    else
        echo "❌ Backend failed to start"
        exit 1
    fi
    
    cd ..
fi

# Check if frontend is already running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend already running on port 5173"
else
    echo "🌐 Starting frontend..."
    npm run dev
fi

echo "🎉 Attribution Guard is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3001"
