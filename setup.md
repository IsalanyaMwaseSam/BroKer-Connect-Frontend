# BrokerConnect Setup Guide

## Prerequisites
- Node.js 16+
- MySQL Server
- Git

## Database Setup

1. **Install MySQL** (if not already installed)
2. **Create Database**:
   ```sql
   CREATE DATABASE brokers;
   ```
3. **Update credentials** in `backend/.env` if needed

## Installation Steps

### 1. Frontend Setup
```bash
cd BrokerConnect
npm install
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Initialize Database
```bash
cd backend
npm run init-db
```

### 4. Start Backend Server
```bash
cd backend
npm run dev
```

### 5. Start Frontend (in new terminal)
```bash
cd BrokerConnect
npm start
```

## Default Login Credentials

- **Broker**: broker@test.com / password123
- **Client**: client@test.com / password123  
- **Admin**: admin@test.com / password123

## Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Features Completed

✅ User Authentication (Login/Register)
✅ Role-based Access (Broker/Client/Admin)
✅ Property Listings with Filters
✅ Responsive Mobile-First Design
✅ MySQL Database Integration
✅ Sleek UI with Small Fonts
✅ Default Demo Credentials

## Next Steps

- Add property creation for brokers
- Implement messaging system
- Add booking functionality
- Integrate payment systems
- Add admin dashboard