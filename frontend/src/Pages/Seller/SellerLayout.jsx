import React, { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
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
  Store,
  ArrowLeft,
} from "lucide-react";
import { AppContext } from "../../contexts/AppContext";

function SellerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleLogout, user } = useContext(AppContext);

  const navItems = [
    { path: "/seller", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/seller/products", icon: Package, label: "Products" },
    { path: "/seller/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/seller/messages", icon: MessageSquare, label: "Messages" },
    { path: "/seller/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/seller/customers", icon: Users, label: "Customers" },
    { path: "/seller/payouts", icon: DollarSign, label: "Payouts" },
    { path: "/seller/settings", icon: Settings, label: "Settings" },
  ];

  const handleSellerLogout = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-orange-500 via-orange-50/40 to-white">
      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-orange-100 p-2">
              <Store size={18} className="text-orange-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Seller Workspace</p>
              <p className="text-xs text-slate-500">{user?.name || "Seller"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
              Store
            </button>
            <button
              onClick={handleSellerLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl gap-4 px-4 py-5 md:px-6 md:py-6">
        <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-64 self-start overflow-y-auto rounded-2xl bg-slate-900 p-3 text-slate-100 shadow-lg md:block">
          <p className="px-3 pb-2 text-xs uppercase tracking-wide text-slate-400">Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-orange-500 text-white shadow"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-xl">
          <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                    active
                      ? "bg-orange-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default SellerLayout;
