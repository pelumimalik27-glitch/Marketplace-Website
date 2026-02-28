import React, { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";

function AdminLayout() {
  const { user, handleLogout } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <div className="sticky top-0 z-40 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Admin Console</p>
            <p className="text-xs text-slate-500">{user?.name || "Admin"}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Store
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl gap-4 px-4 py-5 md:px-6">
        <aside className="hidden w-52 rounded-xl border bg-white p-2 md:block">
          <Link
            to="/admin/dashboard"
            className={`block rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/admin/dashboard"
                ? "bg-orange-50 text-orange-700"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            Dashboard
          </Link>
        </aside>
        <main className="min-w-0 flex-1 rounded-xl border bg-white p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
