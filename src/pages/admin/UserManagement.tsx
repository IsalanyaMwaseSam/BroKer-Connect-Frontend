import React, { useState, useEffect } from 'react';
import { Search, Filter, Ban, CheckCircle, AlertTriangle, MoreVertical, Mail, Phone } from 'lucide-react';
import { User } from '../../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { adminService } = await import('../../services/admin');
      const users = await adminService.getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'verified') {
        filtered = filtered.filter(user => user.isVerified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(user => !user.isVerified);
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    if (action === 'delete' && !window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (action === 'delete') {
      setUsers(prev => prev.filter(u => u.id !== userId));
    } else {
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, isVerified: action === 'activate' }
          : u
      ));
    }
    setSelectedUser(null);
  };

  const getUserStats = () => {
    const total = users.length;
    const brokers = users.filter(u => u.role === 'broker').length;
    const clients = users.filter(u => u.role === 'client').length;
    const verified = users.filter(u => u.isVerified).length;
    
    return { total, brokers, clients, verified };
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600">{stats.total} total users • {stats.verified} verified</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Users</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Brokers</p>
                <p className="text-xl font-bold text-gray-900">{stats.brokers}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Clients</p>
                <p className="text-xl font-bold text-gray-900">{stats.clients}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Verified</p>
                <p className="text-xl font-bold text-gray-900">{stats.verified}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Roles</option>
              <option value="broker">Brokers</option>
              <option value="client">Clients</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            <button className="btn-secondary flex items-center justify-center space-x-2">
              <Filter size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'broker' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'client' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {user.isVerified ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm">
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {user.createdAt.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, user.isVerified ? 'suspend' : 'activate')}
                          className={`text-sm ${user.isVerified ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                        >
                          {user.isVerified ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">User Details</h3>
                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-xl font-medium text-gray-600">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-600">{selectedUser.role}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{selectedUser.phone}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleUserAction(selectedUser.id, selectedUser.isVerified ? 'suspend' : 'activate')}
                    className={`flex-1 py-2 px-4 rounded text-sm font-medium ${
                      selectedUser.isVerified 
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {selectedUser.isVerified ? 'Suspend User' : 'Activate User'}
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="flex-1 py-2 px-4 rounded text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;