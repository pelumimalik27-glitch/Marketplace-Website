import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { fetchMySellerProfile, fetchSellerOrders } from "../../lib/sellerApi";

const asId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

function SellerPayouts() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sellerProfile, setSellerProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadPayouts = async () => {
    try {
      setLoading(true);
      setError("");
      const profile = await fetchMySellerProfile(user?.userId);
      setSellerProfile(profile);
      if (!profile?._id) {
        setOrders([]);
        return;
      }
      const list = await fetchSellerOrders(profile._id);
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, [user?.userId]);

  const sellerOrderTotal = (order) => {
    const sellerId = String(sellerProfile?._id || "");
    const items = Array.isArray(order?.items) ? order.items : [];
    return items
      .filter((item) => asId(item?.seller) === sellerId)
      .reduce((sum, item) => sum + Number(item?.total || 0), 0);
  };

  const payoutRows = useMemo(() => {
    return orders
      .map((order) => ({
        id: String(order?._id || ""),
        date: order?.createdAt || null,
        status: String(order?.status || "pending").toLowerCase(),
        amount: sellerOrderTotal(order),
      }))
      .filter((row) => (statusFilter === "all" ? true : row.status === statusFilter))
      .sort(
        (a, b) =>
          new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()
      );
  }, [orders, statusFilter, sellerProfile]);

  const summary = useMemo(() => {
    const total = payoutRows.reduce((sum, row) => sum + row.amount, 0);
    const available = payoutRows
      .filter((row) => row.status === "completed")
      .reduce((sum, row) => sum + row.amount, 0);
    const pending = payoutRows
      .filter((row) => row.status !== "completed" && row.status !== "cancelled")
      .reduce((sum, row) => sum + row.amount, 0);
    const cancelled = payoutRows
      .filter((row) => row.status === "cancelled")
      .reduce((sum, row) => sum + row.amount, 0);

    return {
      total,
      available,
      pending,
      cancelled,
      count: payoutRows.length,
    };
  }, [payoutRows]);

  const monthlySummary = useMemo(() => {
    const map = new Map();
    payoutRows.forEach((row) => {
      const date = row.date ? new Date(row.date) : null;
      if (!date || Number.isNaN(date.getTime())) return;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const prev = map.get(monthKey) || { orders: 0, total: 0 };
      prev.orders += 1;
      prev.total += row.amount;
      map.set(monthKey, prev);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-6)
      .map(([key, value]) => ({ key, ...value }));
  }, [payoutRows]);

  const exportReport = () => {
    const header = ["OrderId", "Date", "Status", "Amount"];
    const lines = payoutRows.map((row) => [
      row.id,
      row.date ? new Date(row.date).toISOString() : "",
      row.status,
      Number(row.amount || 0).toFixed(2),
    ]);
    const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "seller-payout-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Payouts</h1>
          <p className="text-sm text-slate-600">{sellerProfile?.storeName || "Seller Store"}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadPayouts}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Refresh
          </button>
          <button
            onClick={exportReport}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Export CSV
          </button>
          <button
            onClick={() => navigate("/seller/orders")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">Total: {money(summary.total)}</div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
          Available: {money(summary.available)}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">Pending: {money(summary.pending)}</div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm">
          Cancelled: {money(summary.cancelled)}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm">Orders: {summary.count}</div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="pending">pending</option>
            <option value="processing">processing</option>
            <option value="shipped">shipped</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <button
            onClick={() => navigate("/seller/settings")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Open Settings
          </button>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            Showing: {payoutRows.length}
          </div>
        </div>
      </div>

      {loading && <div className="rounded border bg-white p-4 text-sm">Loading...</div>}
      {!loading && error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payoutRows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-gray-500" colSpan={5}>
                      No payout data found.
                    </td>
                  </tr>
                ) : (
                  payoutRows.map((row) => (
                    <tr key={row.id} className="border-t">
                      <td className="px-4 py-3 font-medium">#{row.id.slice(-8)}</td>
                      <td className="px-4 py-3">
                        {row.date ? new Date(row.date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3">{row.status}</td>
                      <td className="px-4 py-3">{money(row.amount)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate("/seller/orders")}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100"
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b p-4">
              <h2 className="text-base font-semibold">Monthly Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3">Month</th>
                    <th className="px-4 py-3">Orders</th>
                    <th className="px-4 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlySummary.length === 0 ? (
                    <tr>
                      <td className="px-4 py-4 text-gray-500" colSpan={3}>
                        No monthly data available.
                      </td>
                    </tr>
                  ) : (
                    monthlySummary.map((row) => (
                      <tr key={row.key} className="border-t">
                        <td className="px-4 py-3">{row.key}</td>
                        <td className="px-4 py-3">{row.orders}</td>
                        <td className="px-4 py-3">{money(row.total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SellerPayouts;
