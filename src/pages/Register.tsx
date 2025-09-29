import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, FileText, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') as 'broker' | 'client' || 'client';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: defaultRole,
    licenseNumber: '',
    nin: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'broker' && {
          licenseNumber: formData.licenseNumber,
          nin: formData.nin
        })
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">BC</span>
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-1 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="client">Property Seeker</option>
              <option value="broker">Broker/Agent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="+256 700 000 000"
              />
            </div>
          </div>

          {formData.role === 'broker' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                <div className="relative">
                  <FileText size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter license number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">National ID (NIN)</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="nin"
                    type="text"
                    required
                    value={formData.nin}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter NIN"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10"
                placeholder="Create password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;