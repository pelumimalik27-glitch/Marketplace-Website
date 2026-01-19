import React, { useState, useContext } from 'react'
import { ShoppingCart, Warehouse, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../contexts/AppContext';

function Cooperative() {
  const [activeView, setActiveView] = useState("");
  const { user } = useContext(AppContext);
 
  return (
    <div className='bg-slate-100 rounded-md mt-3 border p-4 '>
      <h1 className='flex text-black font-bold mb-3'>
        Elite Mode: 
        <span className='text-gray-600 font-normal ml-2'>Switch between users to explore all features</span>
      </h1>
      
      <ul className='flex gap-3'>
        <Link to="/">
          <li
            onClick={() => setActiveView("buyer")}
            className={`flex px-4 py-2 border-2 rounded-lg items-center gap-2 cursor-pointer transition
              ${activeView === "buyer" || user?.role === 'buyer'
                ? "bg-orange-700 text-white border-orange-700"
                : "bg-white text-black hover:bg-gray-50"
              }`}
          >
            <ShoppingCart size={18} />
            <p>Buyer View</p>
          </li>
        </Link>
        
        <Link to="/seller">
          <li
            onClick={() => setActiveView("seller")}
            className={`flex px-4 py-2 border-2 rounded-lg items-center gap-2 cursor-pointer transition
              ${activeView === "seller" || user?.role === 'seller'
                ? "bg-black text-white border-black"
                : "bg-white text-black hover:bg-gray-50"
              }`}
          >
            <Warehouse size={18} />
            <p>Seller View</p>
          </li>
        </Link>
        
        <Link to="/admin">
          <li
            onClick={() => setActiveView("admin")}
            className={`flex px-4 py-2 border-2 rounded-lg items-center gap-2 cursor-pointer transition
              ${activeView === "admin" || user?.role === 'admin'
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-black hover:bg-gray-50"
              }`}
          >
            <Shield size={18} />
            <p>Admin View</p>
          </li>
        </Link>
      </ul>
    </div>
  );
}

export default Cooperative;