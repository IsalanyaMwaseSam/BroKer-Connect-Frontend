import React, { useState, useEffect } from 'react';
import { Check, X, Eye, FileText, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';
import { Broker } from '../../types';

const BrokerVerification: React.FC = () => {
  const [pendingBrokers, setPendingBrokers] = useState<Broker[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBrokers();
  }, []);

  const loadBrokers = async () => {
    try {
      const { adminService } = await import('../../services/admin');
      const brokers = await adminService.getPendingBrokers();
      setPendingBrokers(brokers);
    } catch (error) {
      console.error('Failed to load brokers:', error);
    }
  };

  const handleVerification = async (brokerId: string, action: 'approve' | 'reject', reason?: string) => {
    setLoading(true);
    
    try {
      const { adminService } = await import('../../services/admin');
      await adminService.verifyBroker(brokerId, action);
      
      // Update local state
      setPendingBrokers(prev => prev.map(broker => 
        broker.id === brokerId 
          ? { ...broker, verificationStatus: action === 'approve' ? 'verified' : 'rejected', isVerified: action === 'approve' }
          : broker
      ));
      
      setSelectedBroker(null);
    } catch (error) {
      console.error('Failed to verify broker:', error);
      alert('Failed to update broker verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBrokers = pendingBrokers.filter(broker => {
    if (filter === 'all') return true;
    return broker.verificationStatus === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Broker Verification</h1>
            <p className="text-sm text-gray-600">{pendingBrokers.filter(b => b.verificationStatus === 'pending').length} brokers awaiting verification</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'pending', label: 'Pending', count: pendingBrokers.filter(b => b.verificationStatus === 'pending').length },
            { key: 'verified', label: 'Verified', count: pendingBrokers.filter(b => b.verificationStatus === 'verified').length },
            { key: 'rejected', label: 'Rejected', count: pendingBrokers.filter(b => b.verificationStatus === 'rejected').length },
            { key: 'all', label: 'All', count: pendingBrokers.length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brokers List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredBrokers.map(broker => (
                <div key={broker.id} className="card hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedBroker(broker)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {broker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{broker.name}</h3>
                        <p className="text-sm text-gray-600">{broker.email}</p>
                        <p className="text-xs text-gray-500">License: {broker.licenseNumber}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        broker.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        broker.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {broker.verificationStatus}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {broker.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Broker Details Panel */}
          <div className="lg:col-span-1">
            {selectedBroker ? (
              <div className="card sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Verification Details</h3>
                  <button 
                    onClick={() => setSelectedBroker(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-600">
                        {selectedBroker.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900">{selectedBroker.name}</h4>
                    <p className="text-sm text-gray-600">{selectedBroker.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm">{selectedBroker.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">License Number</p>
                        <p className="text-xs text-gray-600">{selectedBroker.licenseNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">National ID (NIN)</p>
                        <p className="text-xs text-gray-600">{selectedBroker.nin}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Application Date</p>
                        <p className="text-xs text-gray-600">{selectedBroker.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedBroker.verificationStatus === 'pending' && (
                    <div className="space-y-3 pt-4 border-t">
                      <button
                        onClick={() => handleVerification(selectedBroker.id, 'approve')}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <Check size={16} />
                        <span>{loading ? 'Processing...' : 'Approve Broker'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleVerification(selectedBroker.id, 'reject')}
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        <X size={16} />
                        <span>Reject Application</span>
                      </button>
                    </div>
                  )}

                  {selectedBroker.verificationStatus === 'verified' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Verified Broker</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">This broker can now list properties</p>
                    </div>
                  )}

                  {selectedBroker.verificationStatus === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Application Rejected</span>
                      </div>
                      <p className="text-xs text-red-600 mt-1">Broker cannot access platform features</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center py-8">
                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a broker to view verification details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerVerification;