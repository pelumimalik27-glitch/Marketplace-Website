import React, { useContext } from "react";
import { LogOut, User, ShoppingBag, HelpCircle, Package } from "lucide-react";
import MainHeader from "./MainHeader";
import HeaderTittle from "./HeaderTittle";
import Cooperative from "../Home/Cooperative";
import { AppContext } from "../../contexts/AppContext";
import { Link } from "react-router-dom";

function Header() {
  const { handleLogout, user, cart } = useContext(AppContext);

  return (
    <>
      <div className="sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-orange-700 px-6 h-9 flex justify-between items-center">
          <h4 className="text-white font-bold text-sm">
            🎉 Welcome to Elite MarketPlace !
          </h4>

          <div className="flex gap-6 items-center">
            <Link to="/help" className="text-white hover:underline text-sm flex items-center gap-1">
              <HelpCircle size={14} />
              Help
            </Link>
            <Link to="/orderpage" className="text-white hover:underline text-sm">
              Track Order
            </Link>
            
            {user?.role === 'seller' && (
              <Link to="/seller" className="text-white hover:underline text-sm flex items-center gap-1">
                <ShoppingBag size={14} />
                Seller Panel
              </Link>
            )}
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-white hover:underline text-sm flex items-center gap-1">
                <Package size={14} />
                Admin Panel
              </Link>
            )}

            <span
              onClick={handleLogout}
              className="flex gap-1 items-center cursor-pointer hover:underline text-sm"
            >
              <LogOut className="w-4 text-white" />
              <span className="text-white">Logout</span>
            </span>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="bg-white shadow">
          <MainHeader />
        </div>
        
        {/* Navigation Bar */}
        <HeaderTittle />
      </div>
      
      {/* Demo Mode Switcher */}
      <div className="pt-4">
        <Cooperative />
      </div>
    </>
  );
}

export default Header;