import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useOrder } from '../../contexts/OrderContext';
import { Package, Truck, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

function OrderPage() {
  const { orders } = useOrder();
  const { fileDispute } = useContext(AppContext);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={16} />;
      case 'Shipped': return <Truck size={16} />;
      case 'Processing': return <Package size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-600 mb-8">Track and manage your orders</p>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/shoppage"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">Order #{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Placed on {order.date}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600">
                      <Download size={16} />
                      Invoice
                    </button>
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <button className="text-orange-600 hover:text-orange-700">
                        Track Order
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-bold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.qty} • ${item.price.toFixed(2)} each</p>
                          </div>
                          <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-bold mb-4">Order Summary</h3>
                    <div className="space-y-3 p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <span>Subtotal ({order.items.length} items)</span>
                        <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${order.shipping?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="font-bold">Total</span>
                        <span className="text-xl font-bold text-orange-600">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Seller Sub-Orders */}
                    {order.subOrders && (
                      <div className="mt-6">
                        <h4 className="font-bold mb-3">Seller Breakdown</h4>
                        <div className="space-y-3">
                          {order.subOrders.map((subOrder, idx) => (
                            <div key={idx} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{subOrder.sellerName}</span>
                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(subOrder.status)}`}>
                                  {subOrder.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Tracking: {subOrder.tracking || 'Not available yet'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
                  {order.status === 'Delivered' ? (
                    <>
                      <button className="px-4 py-2 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50">
                        Leave Review
                      </button>
                      <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Buy Again
                      </button>
                      <Link
                        to={`/dispute/${order.id}`}
                        className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                      >
                        <AlertTriangle size={16} />
                        File Dispute
                      </Link>
                    </>
                  ) : order.status === 'Cancelled' ? (
                    <span className="text-red-600 font-medium">This order was cancelled</span>
                  ) : (
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      Track Order
                    </button>
                  )}
                  
                  {order.status !== 'Cancelled' && (
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Contact Support
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderPage;