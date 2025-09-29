import React from 'react';
import { User, Key } from 'lucide-react';

const LoginCredentials: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
      <div className="flex items-center mb-2">
        <Key size={16} className="text-blue-600 mr-2" />
        <h4 className="text-sm font-medium text-blue-800">Demo Credentials</h4>
      </div>
      <div className="space-y-2 text-xs text-blue-700">
        <div className="flex items-center">
          <User size={14} className="mr-2" />
          <div>
            <div><strong>Broker:</strong> broker@test.com</div>
            <div><strong>Client:</strong> client@test.com</div>
            <div><strong>Admin:</strong> admin@test.com</div>
            <div><strong>Password:</strong> password123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCredentials;