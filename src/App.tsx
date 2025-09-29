import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/Auth/AuthProvider';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import BrokerDashboard from './pages/broker/BrokerDashboard';
import AddProperty from './pages/broker/AddProperty';
import BrokerProperties from './pages/broker/BrokerProperties';
import ClientDashboard from './pages/client/ClientDashboard';
import Favorites from './pages/client/Favorites';
import AdminDashboard from './pages/admin/AdminDashboard';
import BrokerVerification from './pages/admin/BrokerVerification';
import UserManagement from './pages/admin/UserManagement';
import PropertyOversight from './pages/admin/PropertyOversight';
import PropertyDetail from './pages/PropertyDetail';
import BrokerMessages from './pages/broker/BrokerMessages';
import BrokerBookings from './pages/broker/BrokerBookings';
import MyBookings from './pages/client/MyBookings';
import MyProperties from './pages/client/MyProperties';
import DashboardRouter from './components/DashboardRouter';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } />
              
              {/* Broker Routes */}
              <Route path="/broker/dashboard" element={
                <ProtectedRoute roles={['broker']}>
                  <BrokerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/broker/properties/new" element={
                <ProtectedRoute roles={['broker']}>
                  <AddProperty />
                </ProtectedRoute>
              } />
              
              {/* Client Routes */}
              <Route path="/client/dashboard" element={
                <ProtectedRoute roles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              <Route path="/client/favorites" element={
                <ProtectedRoute roles={['client']}>
                  <Favorites />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/brokers" element={
                <ProtectedRoute roles={['admin']}>
                  <BrokerVerification />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/properties" element={
                <ProtectedRoute roles={['admin']}>
                  <PropertyOversight />
                </ProtectedRoute>
              } />
              <Route path="/broker/properties" element={
                <ProtectedRoute roles={['broker']}>
                  <BrokerProperties />
                </ProtectedRoute>
              } />
              <Route path="/broker/messages" element={
                <ProtectedRoute roles={['broker']}>
                  <BrokerMessages />
                </ProtectedRoute>
              } />
              <Route path="/broker/bookings" element={
                <ProtectedRoute roles={['broker']}>
                  <BrokerBookings />
                </ProtectedRoute>
              } />
              
              {/* Property Detail */}
              <Route path="/properties/:id" element={<PropertyDetail />} />
              
              {/* Client Bookings */}
              <Route path="/my-bookings" element={
                <ProtectedRoute roles={['client']}>
                  <MyBookings />
                </ProtectedRoute>
              } />
              
              {/* Client Properties */}
              <Route path="/my-properties" element={
                <ProtectedRoute roles={['client']}>
                  <MyProperties />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;