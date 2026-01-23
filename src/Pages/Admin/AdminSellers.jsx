import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Search, Filter, CheckCircle, XCircle, MoreVertical,Users ,Clock, Mail, Phone, Shield } from 'lucide-react';

function AdminSellers() {
  const { sellers, setSellers } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Verified' && seller.verified) ||
      (statusFilter === 'Pending' && !seller.verified);
    return matchesSearch && matchesStatus;
  });

  const handleVerification = (id, verified) => {
    setSellers(sellers.map(seller => 
      seller.id === id ? { ...seller, verified } : seller
    ));
  };

  const handleSuspend = (id) => {
    if (window.confirm('Are you sure you want to suspend this seller?')) {
      setSellers(sellers.map(seller => 
        seller.id === id ? { ...seller, suspended: true } : seller
      ));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seller Management</h1>
        <p className="text-gray-600 mt-2">Manage seller accounts and verifications</p>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="All">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Sellers Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Seller</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Products</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Join Date</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map(seller => (
                <tr key={seller.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-lg">{seller.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{seller.name}</p>
                        <p className="text-sm text-gray-500">ID: {seller.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        seller.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {seller.verified ? 'Verified' : 'Pending'}
                      </span>
                      {seller.suspended && (
                        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{seller.products}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="font-bold mr-2">{seller.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(seller.rating) ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">Mar 15, 2025</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!seller.verified ? (
                        <>
                          <button 
                            onClick={() => handleVerification(seller.id, true)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleVerification(seller.id, false)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                            <Mail size={18} />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                            <Phone size={18} />
                          </button>
                          <button 
                            onClick={() => handleSuspend(seller.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Shield size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Sellers</p>
              <p className="text-2xl font-bold">{sellers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Verified Sellers</p>
              <p className="text-2xl font-bold">{sellers.filter(s => s.verified).length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold">{sellers.filter(s => !s.verified).length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSellers;