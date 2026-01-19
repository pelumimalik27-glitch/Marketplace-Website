import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Filter, CreditCard, Wallet, History, Clock, CheckCircle } from 'lucide-react';

function SellerPayouts() {
  const [timeRange, setTimeRange] = useState('month');
  
  const payoutStats = {
    totalEarnings: 12847.50,
    availableBalance: 3245.75,
    pendingPayout: 9601.75,
    nextPayout: 'Apr 15, 2025',
    commissionRate: '15%',
    totalPayouts: 42,
    avgPayout: 305.89,
  };
  
  const payoutHistory = [
    { id: 1, date: 'Mar 15, 2025', amount: 2450.50, status: 'Completed', method: 'Bank Transfer', reference: 'PAY-789012' },
    { id: 2, date: 'Feb 28, 2025', amount: 1980.25, status: 'Completed', method: 'PayPal', reference: 'PAY-789011' },
    { id: 3, date: 'Feb 15, 2025', amount: 3120.75, status: 'Completed', method: 'Bank Transfer', reference: 'PAY-789010' },
    { id: 4, date: 'Jan 31, 2025', amount: 2750.00, status: 'Completed', method: 'PayPal', reference: 'PAY-789009' },
    { id: 5, date: 'Jan 15, 2025', amount: 2546.50, status: 'Completed', method: 'Bank Transfer', reference: 'PAY-789008' },
  ];
  
  const upcomingPayouts = [
    { id: 1, date: 'Apr 15, 2025', amount: 9601.75, status: 'Processing', orders: 58 },
    { id: 2, date: 'Apr 30, 2025', amount: 1250.25, status: 'Pending', orders: 12 },
  ];
  
  const paymentMethods = [
    { type: 'Bank Transfer', details: '**** **** **** 1234', isPrimary: true },
    { type: 'PayPal', details: 'seller@example.com', isPrimary: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payouts & Earnings</h1>
          <p className="text-gray-600 mt-2">Track your earnings and manage payouts</p>
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
              <option value="quarter">Last Quarter</option>
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
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold mt-2">${payoutStats.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={14} />
                +12.5% from last period
              </p>
            </div>
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Available Balance</p>
              <p className="text-3xl font-bold mt-2">${payoutStats.availableBalance.toLocaleString()}</p>
              <button className="text-sm text-orange-600 mt-2 hover:text-orange-700">
                Request Payout →
              </button>
            </div>
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <Wallet size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Pending Payout</p>
              <p className="text-3xl font-bold mt-2">${payoutStats.pendingPayout.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                <Calendar size={14} />
                Next: {payoutStats.nextPayout}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Commission Rate</p>
              <p className="text-3xl font-bold mt-2">{payoutStats.commissionRate}</p>
              <p className="text-sm text-gray-600 mt-1">Platform fee on sales</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Payment Methods</h3>
            <button className="text-orange-600 hover:text-orange-700 text-sm">
              + Add New
            </button>
          </div>
          
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className={`p-4 border rounded-lg ${method.isPrimary ? 'border-orange-300 bg-orange-50' : ''}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded">
                      <CreditCard size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{method.type}</p>
                      <p className="text-sm text-gray-500">{method.details}</p>
                    </div>
                  </div>
                  {method.isPrimary && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Payouts are processed every 15 days. Minimum payout amount is $50.
            </p>
          </div>
        </div>
        
        {/* Upcoming Payouts */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-6">Upcoming Payouts</h3>
          
          <div className="space-y-4">
            {upcomingPayouts.map(payout => (
              <div key={payout.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Scheduled: {payout.date}</p>
                    <p className="text-sm text-gray-500">{payout.orders} orders • {payout.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">${payout.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      {payout.status === 'Processing' ? 'Will be processed in 3 days' : 'Awaiting clearance'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 font-medium">
            Request Early Payout
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-6">Payout Summary</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Total Payouts', value: payoutStats.totalPayouts, change: '+8' },
              { label: 'Average Payout', value: `$${payoutStats.avgPayout}`, change: '+$12.50' },
              { label: 'Success Rate', value: '100%', change: 'Perfect record' },
              { label: 'Processing Time', value: '2-3 days', change: 'Standard' },
            ].map((stat, index) => (
              <div key={index} className="flex justify-between items-center p-3 border-b">
                <span className="text-gray-600">{stat.label}</span>
                <div className="text-right">
                  <p className="font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Payout History */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Payout History</h3>
          <button className="text-orange-600 hover:text-orange-700 flex items-center gap-2">
            <History size={18} />
            View All History
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Method</th>
                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map(payout => (
                <tr key={payout.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{payout.date}</td>
                  <td className="p-4">
                    <div className="font-bold">${payout.amount.toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1 w-fit">
                      <CheckCircle size={12} />
                      {payout.status}
                    </span>
                  </td>
                  <td className="p-4">{payout.method}</td>
                  <td className="p-4">
                    <div className="text-sm text-gray-500">{payout.reference}</div>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Download Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SellerPayouts;