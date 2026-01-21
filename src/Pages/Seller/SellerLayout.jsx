import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3,
  Settings,
  MessageSquare,
  DollarSign,
  Users,
  LogOut,
  Store
} from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';
import { useContext } from 'react';

function SellerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout } = useContext(AppContext);
  
  const navItems = [
    { path: '/seller', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/seller/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/seller/orders', icon: <ShoppingBag size={20} />, label: 'Orders' },
    { path: '/seller/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/seller/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { path: '/seller/payouts', icon: <DollarSign size={20} />, label: 'Payouts' },
    { path: '/seller/customers', icon: <Users size={20} />, label: 'Customers' },    { path: '/seller/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleSellerLogout = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='flex'>
        {/* Sidebar */}
        <div className='w-64 bg-white shadow-lg min-h-screen border-r'>
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Store size={24} className="text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sony Store</h1>
                <p className="text-gray-500 text-sm">Premium Electronics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">Store Active</span>
            </div>
          </div>
          
          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  location.pathname === item.path 
                    ? 'bg-orange-100 text-orange-700 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t mt-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Store Performance</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-lg">4.8/5</span>
                <span className="text-sm text-green-600">+12% this month</span>
              </div>
            </div>
            
            <button
              onClick={handleSellerLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
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

export default SellerLayout;