import React, { useContext } from 'react'
import { AppContext } from '../../contexts/AppContext'
import { useOrder } from '../../contexts/OrderContext';
import products from '../../components/Data/Product';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  TrendingUp,
  Star,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

function SellerDashboard() {
  const { user } = useContext(AppContext);
  const { orders } = useOrder();
  
  const sellerId = 1; // Assuming current seller ID is 1
  const myProducts = products.filter(p => p.seller.includes('Sony')); // Filter by seller name
  const myOrders = orders.filter(order => 
    order.subOrders?.some(sub => sub.sellerId === sellerId)
  );
  
  const pendingOrders = myOrders.filter(o => 
    o.subOrders?.find(s => s.sellerId === sellerId)?.status === 'Pending'
  ).length;
  
  const completedOrders = myOrders.filter(o => 
    o.subOrders?.find(s => s.sellerId === sellerId)?.status === 'Delivered'
  ).length;
  
  const totalRevenue = myOrders.reduce((sum, order) => {
    const subOrder = order.subOrders?.find(s => s.sellerId === sellerId);
    return sum + (subOrder?.total || 0);
  }, 0);

  const stats = [
    { 
      title: 'Total Revenue', 
      value: `$${totalRevenue.toFixed(2)}`, 
      icon: <DollarSign size={24} />, 
      change: '+12.5%', 
      color: 'bg-green-100 text-green-700' 
    },
    { 
      title: 'Total Products', 
      value: myProducts.length, 
      icon: <Package size={24} />, 
      change: '+3 new', 
      color: 'bg-blue-100 text-blue-700' 
    },
    { 
      title: 'Pending Orders', 
      value: pendingOrders, 
      icon: <ShoppingBag size={24} />, 
      change: '2 urgent', 
      color: 'bg-yellow-100 text-yellow-700' 
    },
    { 
      title: 'Completed Orders', 
      value: completedOrders, 
      icon: <TrendingUp size={24} />, 
      change: '+8 this month', 
      color: 'bg-purple-100 text-purple-700' 
    },
  ];

  const recentOrders = myOrders.slice(0, 5).map(order => {
    const subOrder = order.subOrders?.find(s => s.sellerId === sellerId);
    return {
      id: order.id,
      customer: order.customer.name,
      total: subOrder?.total || 0,
      status: subOrder?.status || 'Pending',
      date: order.date,
      items: subOrder?.items?.length || 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'Seller'}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your store today</p>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Order ID</th>
                    <th className="p-4 text-left">Customer</th>
                    <th className="p-4 text-left">Total</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">#{order.id}</td>
                      <td className="p-4">{order.customer}</td>
                      <td className="p-4">${order.total.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700">
                Add New Product
              </button>
              <button className="w-full border-2 border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50">
                View Messages
              </button>
              <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50">
                Update Store Settings
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-lg mb-4">Store Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-2 font-bold">4.5/5.0</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-bold">2.4 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Fulfillment</span>
                <span className="font-bold">98.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;