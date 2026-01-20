import React, { useState } from 'react';
import { Search, Filter, User, Star, ShoppingBag, Clock, Mail, Phone, MapPin, TrendingUp, DollarSign } from 'lucide-react';

function SellerCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const customers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, USA',
      totalOrders: 12,
      totalSpent: 2450.50,
      lastOrder: 'Mar 15, 2025',
      rating: 4.8,
      status: 'active'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, USA',
      totalOrders: 8,
      totalSpent: 1890.25,
      lastOrder: 'Mar 10, 2025',
      rating: 4.5,
      status: 'active'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, USA',
      totalOrders: 5,
      totalSpent: 1250.75,
      lastOrder: 'Feb 28, 2025',
      rating: 4.2,
      status: 'inactive'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Miami, USA',
      totalOrders: 15,
      totalSpent: 3120.00,
      lastOrder: 'Mar 18, 2025',
      rating: 4.9,
      status: 'active'
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 (555) 567-8901',
      location: 'Houston, USA',
      totalOrders: 3,
      totalSpent: 750.50,
      lastOrder: 'Jan 15, 2025',
      rating: 3.8,
      status: 'inactive'
    },
  ];
  
  const customerStats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    newThisMonth: 8,
    repeatRate: '42%',
    avgOrderValue: 187.25,
    satisfaction: 4.6,
  };
  
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && customer.status === 'active') ||
      (filter === 'inactive' && customer.status === 'inactive') ||
      (filter === 'highvalue' && customer.totalSpent > 2000);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Customer Management</h1>
        <p className="text-gray-600 mt-2">Manage your customer relationships and insights</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold mt-2">{customerStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <User size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Active Customers</p>
              <p className="text-2xl font-bold mt-2">{customerStats.active}</p>
              <p className="text-sm text-green-600 mt-1">+3 this month</p>
            </div>
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">New This Month</p>
              <p className="text-2xl font-bold mt-2">{customerStats.newThisMonth}</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
              <User size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Repeat Rate</p>
              <p className="text-2xl font-bold mt-2">{customerStats.repeatRate}</p>
            </div>
            <div className="p-3 bg-orange-100 text-orange-700 rounded-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Avg. Order Value</p>
              <p className="text-2xl font-bold mt-2">${customerStats.avgOrderValue}</p>
            </div>
            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
              <DollarSign size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Satisfaction</p>
              <p className="text-2xl font-bold mt-2">{customerStats.satisfaction}/5</p>
            </div>
            <div className="p-3 bg-pink-100 text-pink-700 rounded-lg">
              <Star size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="all">All Customers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="highvalue">High Value</option>
                <option value="new">New This Month</option>
              </select>
            </div>
          </div>
          
          <div>
            <button className="w-full p-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50">
              Export Customer List
            </button>
          </div>
          
          <div>
            <button className="w-full p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Send Newsletter
            </button>
          </div>
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Orders</th>
                <th className="p-4 text-left">Total Spent</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Last Order</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${customer.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-xs text-gray-500 capitalize">{customer.status}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className="text-gray-400" />
                        {customer.location}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">{customer.totalOrders}</div>
                    <div className="text-sm text-gray-500">orders</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">${customer.totalSpent.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">total spent</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(customer.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium">{customer.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span>{customer.lastOrder}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200">
                        View
                      </button>
                      <button className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200">
                        Message
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Customer Segments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Top Customers</h3>
          <div className="space-y-4">
            {customers
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 3)
              .map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.totalOrders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${customer.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-green-600">Top {index + 1}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Loyalty Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repeat Customers</span>
              <span className="font-bold">{Math.round(customers.filter(c => c.totalOrders > 1).length / customers.length * 100)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Lifetime Value</span>
              <span className="font-bold">${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Referral Rate</span>
              <span className="font-bold">18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Retention</span>
              <span className="font-bold">85%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700">
              Create Customer Group
            </button>
            <button className="w-full border-2 border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50">
              Send Special Offer
            </button>
            <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
              Request Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerCustomers;