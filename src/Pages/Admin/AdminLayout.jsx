import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  BarChart3,
  Settings,
  FileText,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

function AdminLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/sellers', icon: <Users size={20} />, label: 'Sellers' },
    { path: '/admin/disputes', icon: <AlertTriangle size={20} />, label: 'Disputes' },
    { path: '/admin/products', icon: <FileText size={20} />, label: 'Products' },
    { path: '/admin/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/admin/commissions', icon: <DollarSign size={20} />, label: 'Commissions' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex'>
        {/* Sidebar */}
        <div className='w-64 bg-gray-900 text-white min-h-screen'>
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Platform Management</p>
          </div>
          
          <nav className="p-4 space-y-2">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  location.pathname === item.path 
                    ? 'bg-gray-800 text-white font-semibold' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-800 mt-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Platform Status</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;