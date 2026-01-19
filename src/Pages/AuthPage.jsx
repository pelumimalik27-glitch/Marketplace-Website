import React, { useState, useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import { useNavigate } from 'react-router-dom';
import { Store, User, Shield } from 'lucide-react';

function AuthPage() {
  const { handleLogin } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'buyer' // 'buyer', 'seller', 'admin'
  });
  
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Simulate login based on role
    const userData = {
      token: 'fake-jwt-token',
      role: formData.role,
      username: formData.username,
      name: formData.username.charAt(0).toUpperCase() + formData.username.slice(1),
      email: `${formData.username}@example.com`
    };
    
    handleLogin(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-full mb-4">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Elite Marketplace</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <label className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                formData.role === 'buyer' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={formData.role === 'buyer'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="hidden"
                />
                <User size={24} className="mb-2 text-gray-700" />
                <span className="text-sm font-medium">Buyer</span>
              </label>
              
              <label className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                formData.role === 'seller' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={formData.role === 'seller'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="hidden"
                />
                <Store size={24} className="mb-2 text-gray-700" />
                <span className="text-sm font-medium">Seller</span>
              </label>
              
              <label className={`flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                formData.role === 'admin' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="hidden"
                />
                <Shield size={24} className="mb-2 text-gray-700" />
                <span className="text-sm font-medium">Admin</span>
              </label>
            </div>
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Enter your username"
              />
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                placeholder="Enter your password"
              />
            </div>
            
            {/* Demo Credentials */}
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Login credentials:</p>
              <p>Buyer: buyer / password123</p>
              <p>Seller: seller / password123</p>
              <p>Admin: admin / password123</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium transition"
            >
              Sign In as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              By signing in, you agree to our{' '}
              <a href="#" className="text-orange-600 hover:text-orange-700">Terms</a> and{' '}
              <a href="#" className="text-orange-600 hover:text-orange-700">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;