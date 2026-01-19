import React, { useState, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  MessageSquare,
  Eye,
  TrendingUp
} from 'lucide-react';

function AdminDisputes() {
  const { disputes, setDisputes } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const mockDisputes = [
    {
      id: 1001,
      orderId: 1002,
      customer: 'Jane Smith',
      seller: 'HomeGlow',
      reason: 'Item not as described',
      status: 'Open',
      date: '2025-03-18 10:30',
      amount: 259.99,
      priority: 'High',
      messages: 3,
    },
    {
      id: 1002,
      orderId: 1003,
      customer: 'Robert Johnson',
      seller: 'Urban Wears',
      reason: 'Item damaged',
      status: 'Under Review',
      date: '2025-03-17 14:20',
      amount: 159.99,
      priority: 'Medium',
      messages: 5,
    },
    {
      id: 1003,
      orderId: 1004,
      customer: 'Sarah Williams',
      seller: 'Apple Store',
      reason: 'Item not received',
      status: 'Resolved',
      date: '2025-03-16 09:15',
      amount: 279.99,
      priority: 'Low',
      messages: 8,
    },
  ];
  
  const allDisputes = disputes.length > 0 ? disputes : mockDisputes;
  
  const filteredDisputes = allDisputes.filter(dispute => {
    const matchesSearch = 
      dispute.orderId.toString().includes(searchTerm) ||
      dispute.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.seller.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' || 
      dispute.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  const disputeStats = {
    total: allDisputes.length,
    open: allDisputes.filter(d => d.status === 'Open').length,
    underReview: allDisputes.filter(d => d.status === 'Under Review').length,
    resolved: allDisputes.filter(d => d.status === 'Resolved').length,
    highPriority: allDisputes.filter(d => d.priority === 'High').length,
  };
  
  const handleResolve = (id, decision) => {
    if (decision === 'approve') {
      setDisputes(allDisputes.map(dispute => 
        dispute.id === id ? { ...dispute, status: 'Resolved', resolution: 'Refund Approved' } : dispute
      ));
    } else {
      setDisputes(allDisputes.map(dispute => 
        dispute.id === id ? { ...dispute, status: 'Resolved', resolution: 'Claim Rejected' } : dispute
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dispute Resolution</h1>
        <p className="text-gray-600 mt-2">Review and resolve buyer-seller disputes</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Disputes', value: disputeStats.total, color: 'bg-gray-100 text-gray-700', icon: <AlertTriangle size={20} /> },
          { label: 'Open Cases', value: disputeStats.open, color: 'bg-red-100 text-red-700', icon: <AlertTriangle size={20} /> },
          { label: 'Under Review', value: disputeStats.underReview, color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={20} /> },
          { label: 'Resolved', value: disputeStats.resolved, color: 'bg-green-100 text-green-700', icon: <CheckCircle size={20} /> },
          { label: 'High Priority', value: disputeStats.highPriority, color: 'bg-orange-100 text-orange-700', icon: <TrendingUp size={20} /> },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search disputes..."
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
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <select
                className="w-full p-2 border rounded-lg"
              >
                <option value="">Priority: All</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Disputes Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Dispute ID</th>
                <th className="p-4 text-left">Order/Customer</th>
                <th className="p-4 text-left">Seller</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status/Priority</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDisputes.map(dispute => (
                <tr key={dispute.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">#{dispute.id}</div>
                    <div className="text-sm text-gray-500">Order #{dispute.orderId}</div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{dispute.customer}</p>
                      <p className="text-sm text-gray-500">{dispute.date}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium">{dispute.seller}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{dispute.reason}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MessageSquare size={12} />
                      {dispute.messages} messages
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold">${dispute.amount.toFixed(2)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm w-fit ${
                        dispute.status === 'Open' ? 'bg-red-100 text-red-800' :
                        dispute.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {dispute.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm w-fit ${
                        dispute.priority === 'High' ? 'bg-red-100 text-red-800' :
                        dispute.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {dispute.priority} Priority
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleResolve(dispute.id, 'approve')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleResolve(dispute.id, 'reject')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Resolution Guidelines */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-4">Resolution Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-4 border-red-500 pl-4 py-2">
            <p className="font-medium text-red-700">High Priority Cases</p>
            <p className="text-sm text-gray-600 mt-1">Resolve within 24 hours</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <p className="font-medium text-yellow-700">Evidence Required</p>
            <p className="text-sm text-gray-600 mt-1">Always request proof from both parties</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="font-medium text-green-700">Fair Resolution</p>
            <p className="text-sm text-gray-600 mt-1">Consider seller history and buyer patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDisputes;