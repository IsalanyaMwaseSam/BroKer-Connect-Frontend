import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, AlertTriangle, TrendingUp, Eye, Shield, FileText, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingBrokers: 0,
    activeProperties: 0,
    monthlyRevenue: 0,
    flaggedContent: 0,
    totalTransactions: 0
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'verification', message: '5 brokers pending verification', count: 5, urgent: true },
    { id: 2, type: 'property', message: '3 properties flagged for review', count: 3, urgent: false },
    { id: 3, type: 'user', message: '2 user reports to investigate', count: 2, urgent: true }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { adminService } = await import('../../services/admin');
      const [brokers, users] = await Promise.all([
        adminService.getPendingBrokers(),
        adminService.getAllUsers()
      ]);
      
      const pendingBrokers = brokers.filter(b => b.verificationStatus === 'pending').length;
      
      setStats({
        totalUsers: users.length,
        pendingBrokers,
        activeProperties: 456, // Mock for now
        monthlyRevenue: 12500000, // Mock for now
        flaggedContent: 3, // Mock for now
        totalTransactions: 89 // Mock for now
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">System overview and management</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/admin/reports" className="btn-secondary">View Reports</Link>
            <Link to="/admin/settings" className="btn-primary">Settings</Link>
          </div>
        </div>

        {/* Urgent Alerts */}
        {alerts.filter(a => a.urgent).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-medium text-red-800">Urgent Actions Required</h3>
            </div>
            <div className="space-y-2">
              {alerts.filter(a => a.urgent).map(alert => (
                <div key={alert.id} className="flex justify-between items-center">
                  <span className="text-sm text-red-700">{alert.message}</span>
                  <Link 
                    to={`/admin/${alert.type === 'verification' ? 'brokers' : alert.type === 'property' ? 'properties' : 'users'}`}
                    className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Brokers</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingBrokers}</p>
                <p className="text-xs text-gray-500">Awaiting verification</p>
              </div>
              <UserCheck className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProperties}</p>
                <p className="text-xs text-green-600">+8% this week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.monthlyRevenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500">UGX</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Flagged Content</p>
                <p className="text-2xl font-bold text-red-600">{stats.flaggedContent}</p>
                <p className="text-xs text-gray-500">Needs review</p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                <p className="text-xs text-green-600">This month</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Link to="/admin/brokers" className="card hover:shadow-md transition-shadow">
            <div className="text-center">
              <UserCheck className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">Verify Brokers</h3>
              <p className="text-xs text-gray-600">{stats.pendingBrokers} pending approval</p>
            </div>
          </Link>

          <Link to="/admin/users" className="card hover:shadow-md transition-shadow">
            <div className="text-center">
              <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-xs text-gray-600">View all platform users</p>
            </div>
          </Link>

          <Link to="/admin/properties" className="card hover:shadow-md transition-shadow">
            <div className="text-center">
              <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">Property Oversight</h3>
              <p className="text-xs text-gray-600">Verify and moderate listings</p>
            </div>
          </Link>

          <Link to="/admin/reports" className="card hover:shadow-md transition-shadow">
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-xs text-gray-600">Platform performance data</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Recent Broker Applications</h3>
            <div className="space-y-3">
              {[
                { name: 'John Mukasa', license: 'BL2024001', date: '2 hours ago', status: 'pending' },
                { name: 'Sarah Nakato', license: 'BL2024002', date: '5 hours ago', status: 'pending' },
                { name: 'David Okello', license: 'BL2024003', date: '1 day ago', status: 'verified' }
              ].map((broker, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium">{broker.name}</p>
                    <p className="text-xs text-gray-600">{broker.license} • {broker.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    broker.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {broker.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">System Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'New property listed', user: 'John Broker', time: '10 min ago' },
                { action: 'User reported content', user: 'Jane Client', time: '1 hour ago' },
                { action: 'Broker verified', user: 'Admin', time: '2 hours ago' },
                { action: 'Payment processed', user: 'System', time: '3 hours ago' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;