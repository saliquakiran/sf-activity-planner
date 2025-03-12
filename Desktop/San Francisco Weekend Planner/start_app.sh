#!/bin/bash

echo "🚀 Starting SF Weekend Planner Application..."
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Expected directories: backend/ and frontend/"
    exit 1
fi

echo "📋 Starting Backend API Server..."
echo "   - Flask API will run on http://localhost:5001"
echo "   - Make sure your virtual environment is activated"
echo ""

# Start backend in background
cd backend
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python app.py &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting for backend to start..."
sleep 3

echo ""
echo "🎨 Starting Frontend Development Server..."
echo "   - React app will run on http://localhost:3000"
echo "   - The app will automatically open in your browser"
echo ""

# Start frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; echo '✅ Servers stopped.'; exit 0" INT

# Keep script running
wait
