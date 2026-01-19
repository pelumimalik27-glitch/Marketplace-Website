import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Package,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { sellers, orders, disputes } = useContext(AppContext);
  
  const stats = [
    { 
      title: 'Total Sellers', 
      value: sellers.length, 
      icon: <Users size={24} />, 
      change: '+12 this month', 
      color: 'bg-blue-100 text-blue-700' 
    },
    { 
      title: 'Total Orders', 
      value: orders.length, 
      icon: <ShoppingBag size={24} />, 
      change: '+24% from last month', 
      color: 'bg-green-100 text-green-700' 
    },
    { 
      title: 'Revenue', 
      value: `$${(orders.reduce((sum, o) => sum + o.total, 0) * 0.15).toFixed(2)}`, 
      icon: <DollarSign size={24} />, 
      change: '+18.5%', 
      color: 'bg-purple-100 text-purple-700' 
    },
    { 
      title: 'Open Disputes', 
      value: disputes.filter(d => d.status === 'Open').length, 
      icon: <AlertTriangle size={24} />, 
      change: '3 need attention', 
      color: 'bg-red-100 text-red-700' 
    },
  ];

  const recentSellers = sellers.slice(0, 5);
  const recentDisputes = disputes.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and management</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm mt-1 text-gray-500">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sellers */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={20} />
              Recent Sellers
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                    <th className="p-4 text-left">Seller</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Products</th>
                  <th className="p-4 text-left">Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentSellers.map(seller => (
                  <tr key={seller.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="font-bold">{seller.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{seller.name}</p>
                          <p className="text-sm text-gray-500">ID: {seller.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        seller.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {seller.verified ? 'Verified' : 'Pending'}
                      </span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Disputes */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle size={20} />
              Recent Disputes
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {recentDisputes.length > 0 ? (
              recentDisputes.map(dispute => (
                <div key={dispute.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Order #{dispute.orderId}</p>
                      <p className="text-sm text-gray-500 mt-1">{dispute.reason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      dispute.status === 'Open' ? 'bg-red-100 text-red-800' :
                      dispute.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {dispute.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {dispute.date}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800">
                      View Details →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No open disputes</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Platform Growth</p>
              <p className="text-2xl font-bold">+42%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Products Listed</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">3.8%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;