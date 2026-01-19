import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  ShoppingCart,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

function SellerAnalytics() {
  const [timeRange, setTimeRange] = useState('month');
  
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$12,847.50', 
      change: '+12.5%', 
      icon: <DollarSign size={24} />, 
      color: 'bg-green-100 text-green-700' 
    },
    { 
      title: 'Total Orders', 
      value: '187', 
      change: '+8.2%', 
      icon: <ShoppingCart size={24} />, 
      color: 'bg-blue-100 text-blue-700' 
    },
    { 
      title: 'Avg. Order Value', 
      value: '$68.72', 
      change: '+4.3%', 
      icon: <BarChart3 size={24} />, 
      color: 'bg-purple-100 text-purple-700' 
    },
    { 
      title: 'Conversion Rate', 
      value: '3.8%', 
      change: '+0.5%', 
      icon: <TrendingUp size={24} />, 
      color: 'bg-orange-100 text-orange-700' 
    },
  ];
  
  const monthlyData = [
    { month: 'Jan', revenue: 8500, orders: 42 },
    { month: 'Feb', revenue: 9200, orders: 48 },
    { month: 'Mar', revenue: 10800, orders: 52 },
    { month: 'Apr', revenue: 9850, orders: 45 },
    { month: 'May', revenue: 12847, orders: 58 },
  ];
  
  const topProducts = [
    { name: 'PlayStation 3 Slim Console', sales: 312, revenue: 124788 },
    { name: 'Wireless Headset', sales: 156, revenue: 20280 },
    { name: 'Gaming Controller', sales: 89, revenue: 8010 },
    { name: 'Console Cables', sales: 67, revenue: 4020 },
    { name: 'Gaming Chair', sales: 34, revenue: 13600 },
  ];
  
  const customerMetrics = {
    repeatCustomers: 42,
    newCustomers: 58,
    avgRating: 4.5,
    responseTime: '2.4 hours',
    fulfillmentRate: '98.7%',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your store performance and insights</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={14} />
                  {stat.change} from last period
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Revenue Overview</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Orders</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-sm text-gray-500">{data.month}</div>
                <div className="flex-1">
                  <div className="flex items-center h-8">
                    <div 
                      className="bg-orange-500 h-6 rounded-l"
                      style={{ width: `${(data.revenue / 15000) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-blue-500 h-4 rounded-r"
                      style={{ width: `${(data.orders / 80) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>${data.revenue.toLocaleString()}</span>
                    <span>{data.orders} orders</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-6">Top Performing Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <Package size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12.5%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Metrics */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-6">Customer Metrics</h3>
          <div className="space-y-4">
            {[
              { label: 'Repeat Customers', value: customerMetrics.repeatCustomers, icon: <Users size={20} /> },
              { label: 'New Customers', value: customerMetrics.newCustomers, icon: <Users size={20} /> },
              { label: 'Average Rating', value: customerMetrics.avgRating, icon: <TrendingUp size={20} /> },
              { label: 'Avg. Response Time', value: customerMetrics.responseTime, icon: <Calendar size={20} /> },
              { label: 'Order Fulfillment Rate', value: customerMetrics.fulfillmentRate, icon: <Package size={20} /> },
            ].map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {metric.icon}
                  </div>
                  <span className="font-medium">{metric.label}</span>
                </div>
                <span className="font-bold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
          <h3 className="text-xl font-bold mb-6">Traffic Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { source: 'Direct', percentage: 35, visits: 1250, conversion: '4.2%' },
              { source: 'Organic Search', percentage: 28, visits: 1000, conversion: '3.8%' },
              { source: 'Social Media', percentage: 22, visits: 785, conversion: '2.9%' },
              { source: 'Referral', percentage: 15, visits: 536, conversion: '4.5%' },
            ].map((source, index) => (
              <div key={index} className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{source.percentage}%</div>
                <p className="font-medium mt-2">{source.source}</p>
                <p className="text-sm text-gray-500">{source.visits.toLocaleString()} visits</p>
                <p className="text-sm text-green-600 mt-1">{source.conversion} conversion</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Insights */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-6">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-gray-500 text-sm">Best Selling Day</p>
            <p className="text-lg font-bold">Friday</p>
            <p className="text-sm text-gray-500">+25% more sales</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-gray-500 text-sm">Peak Hours</p>
            <p className="text-lg font-bold">7-9 PM</p>
            <p className="text-sm text-gray-500">Most active time</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <p className="text-gray-500 text-sm">Avg. Cart Value</p>
            <p className="text-lg font-bold">$124.50</p>
            <p className="text-sm text-gray-500">+$18 from last month</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <p className="text-gray-500 text-sm">Return Rate</p>
            <p className="text-lg font-bold">2.4%</p>
            <p className="text-sm text-gray-500">Industry avg: 3.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerAnalytics;