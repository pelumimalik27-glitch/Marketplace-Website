import React, { useMemo } from 'react';
import { useCustomer } from '../../contexts/CustomerContext';
import { useOrder } from '../../contexts/OrderContext';
// import OrderItemChart from './OrderItemChart';
// import useAdminOrderCount from './useAdminOrderCount';

function AdminAnalytic() {
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrder();
  const { customers, isLoading: customersLoading, error: customersError } = useCustomer();


  const analytics = useMemo(() => {
    if (!orders || !customers) return [];

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const platformFeePercentage = 0.15;
    const platformRevenue = totalRevenue * platformFeePercentage;
    
    const avgOrderValue = orders.length > 0 
      ? totalRevenue / orders.length 
      : 0;

    return [
      {
        title: "Total Revenue",
        value: `$${platformRevenue.toFixed(2)}`,
        change: "+15.3% from last month",
        description: "Platform revenue (15% of total sales)",
        isLoading: ordersLoading
      },
      {
        title: "Total Orders",
        value: orders.length.toLocaleString(),
        change: "+12.8% from last month",
        description: "Total orders processed",
        isLoading: ordersLoading
      },
      {
        title: "Total Customers",
        value: customers.length.toLocaleString(),
        change: "+8.5% from last month",
        description: "Active registered customers",
        isLoading: customersLoading
      },
      {
        title: "Avg. Order Value",
        value: `$${avgOrderValue.toFixed(2)}`,
        change: "+8.5% from last month",
        description: "Average revenue per order",
        isLoading: ordersLoading
      }
    ];
  }, [orders, customers, ordersLoading, customersLoading]);


  if (ordersLoading || customersLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (ordersError || customersError) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error Loading Analytics</h3>
          <p className="text-red-600 text-sm mt-1">
            {ordersError?.message || customersError?.message || 'Failed to load analytics data'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">
          Comprehensive marketplace performance metrics
        </p>
        <div className="mt-2 text-xs text-gray-400">
          Data updated in real-time • Platform fee: 15%
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {analytics.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-gray-500 text-sm font-medium">{item.title}</p>
                </div>
                
                <div className="mb-2">
                  {item.isLoading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                      {item.value}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {item.change}
                  </span>
                </div>
                
                {item.description && (
                  <p className="text-gray-400 text-xs mt-3">
                    {item.description}
                  </p>
                )}
              </div>
              
              <div className="ml-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-500 text-lg">
                    {item.icon}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gross Sales</span>
              <span className="font-semibold">
                ${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Platform Fee (15%)</span>
              <span className="font-semibold text-blue-600">
                ${(orders.reduce((sum, o) => sum + (o.total || 0), 0) * 0.15).toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Net Revenue</span>
                <span className="text-xl font-bold text-green-600">
                  ${(orders.reduce((sum, o) => sum + (o.total || 0), 0) * 0.15).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed Orders</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending Orders</div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="mt-6 text-right">
        <p className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

export default AdminAnalytic;