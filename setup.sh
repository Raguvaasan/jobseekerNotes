#!/bin/bash

# Development Setup Script for Jobseeker Profile Application

echo "🚀 Setting up Jobseeker Profile Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Copy environment file
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating environment file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your MySQL password and other settings"
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your MySQL credentials"
echo "2. Create database: CREATE DATABASE jobseeker_db;"
echo "3. Run schema: mysql -u root -p jobseeker_db < backend/database/schema.sql"
echo "4. Start development servers:"
echo "   - Frontend: npm run dev"
echo "   - Backend: npm run dev:backend"
echo ""
echo "Access the application at http://localhost:3000"
