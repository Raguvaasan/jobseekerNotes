#!/bin/sh

# Start backend server in background
cd backend && npm start &

# Start frontend server
cd .. && npm start
