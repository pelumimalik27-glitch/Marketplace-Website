import React, { useState, useContext } from 'react';
import { useOrder } from '../../contexts/OrderContext';
import { AppContext } from '../../contexts/AppContext';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare,
  Printer,
  Download,
  Calendar
} from 'lucide-react';

function SellerOrders() {
  const { orders, updateSubOrderStatus } = useOrder();
  const { user } = useContext(AppContext);
  
  const sellerId = 1; // Assuming current seller ID is 1 (Sony Store)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Filter orders for this seller
  const sellerOrders = orders
    .map(order => {
      const subOrder = order.subOrders?.find(s => s.sellerId === sellerId);
      if (subOrder) {
        return {
          ...order,
          sellerSubOrder: subOrder,
          customer: order.customer,
        };
      }
      return null;
    })
    .filter(Boolean);
  
  // Apply filters
  const filteredOrders = sellerOrders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' || 
      order.sellerSubOrder.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesDate = 
      !selectedDate || 
      order.date.includes(selectedDate);
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  const orderStats = {
    total: sellerOrders.length,
    pending: sellerOrders.filter(o => o.sellerSubOrder.status === 'Pending').length,
    processing: sellerOrders.filter(o => o.sellerSubOrder.status === 'Processing').length,
    shipped: sellerOrders.filter(o => o.sellerSubOrder.status === 'Shipped').length,
    delivered: sellerOrders.filter(o => o.sellerSubOrder.status === 'Delivered').length,
    cancelled: sellerOrders.filter(o => o.sellerSubOrder.status === 'Cancelled').length,
  };
  
  const statusOptions = [
    'All',
    'Pending',
    'Processing', 
    'Shipped',
    'Delivered',
    'Cancelled'
  ];
  
  const handleStatusUpdate = (orderId, newStatus) => {
    updateSubOrderStatus(orderId, sellerId, newStatus, newStatus === 'Shipped' ? 'TRK' + Date.now().toString().slice(-8) : null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600 mt-2">Manage and fulfill customer orders</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Orders', value: orderStats.total, color: 'bg-blue-100 text-blue-700', icon: <Package size={20} /> },
          { label: 'Pending', value: orderStats.pending, color: 'bg-yellow-100 text-yellow-700', icon: <Package size={20} /> },
          { label: 'Processing', value: orderStats.processing, color: 'bg-purple-100 text-purple-700', icon: <Package size={20} /> },
          { label: 'Shipped', value: orderStats.shipped, color: 'bg-indigo-100 text-indigo-700', icon: <Truck size={20} /> },
          { label: 'Delivered', value: orderStats.delivered, color: 'bg-green-100 text-green-700', icon: <CheckCircle size={20} /> },
          { label: 'Cancelled', value: orderStats.cancelled, color: 'bg-red-100 text-red-700', icon: <XCircle size={20} /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="flex-1 border-2 border-orange-600 text-orange-600 py-2 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-2">
              <Download size={18} />
              Export
            </button>
            <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">#{order.id}</div>
                      {order.sellerSubOrder.tracking && (
                        <div className="text-sm text-gray-500">Track: {order.sellerSubOrder.tracking}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {order.sellerSubOrder.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.name} × {item.qty}
                        </div>
                      ))}
                      {order.sellerSubOrder.items.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{order.sellerSubOrder.items.length - 2} more items
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold">${order.sellerSubOrder.total.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        Fee: ${(order.sellerSubOrder.total * 0.15).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${
                          order.sellerSubOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.sellerSubOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.sellerSubOrder.status === 'Processing' ? 'bg-purple-100 text-purple-800' :
                          order.sellerSubOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.sellerSubOrder.status === 'Shipped' && <Truck size={12} />}
                          {order.sellerSubOrder.status === 'Delivered' && <CheckCircle size={12} />}
                          {order.sellerSubOrder.status}
                        </span>
                        
                        {/* Status Update Actions */}
                        {order.sellerSubOrder.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'Processing')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as Processing →
                          </button>
                        )}
                        
                        {order.sellerSubOrder.status === 'Processing' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as Shipped →
                          </button>
                        )}
                        
                        {order.sellerSubOrder.status === 'Shipped' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as Delivered →
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{order.date.split(',')[0]}</div>
                      <div className="text-xs text-gray-500">{order.date.split(',')[1]}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                          <MessageSquare size={18} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="p-4 border-t flex justify-between items-center">
            <div className="text-gray-600">
              Showing {filteredOrders.length} of {sellerOrders.length} orders
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 border rounded hover:bg-gray-50">Previous</button>
              <button className="px-3 py-2 border bg-orange-600 text-white rounded">1</button>
              <button className="px-3 py-2 border rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-2 border rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-2 border rounded hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {sellerOrders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className={`p-3 rounded-full ${
                order.sellerSubOrder.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                order.sellerSubOrder.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.sellerSubOrder.status === 'Shipped' ? <Truck size={20} /> : <Package size={20} />}
              </div>
              <div className="flex-1">
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {order.sellerSubOrder.status} • {order.customer.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.sellerSubOrder.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{order.date.split(',')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SellerOrders;