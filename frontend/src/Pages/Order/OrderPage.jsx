import React, { useContext, useEffect, useMemo, useState } from "react";
import { Package, Truck, CheckCircle, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import { fetchMyOrders } from "../../lib/orderApi";
import { fetchProducts } from "../../lib/productApi";
import { formatNaira } from "../../lib/currency";

const asId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const getStatusColor = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return "bg-green-100 text-green-800";
  if (normalized === "shipped") return "bg-blue-100 text-blue-800";
  if (normalized === "processing") return "bg-yellow-100 text-yellow-800";
  if (normalized === "cancelled") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "completed") return <CheckCircle size={16} />;
  if (normalized === "shipped") return <Truck size={16} />;
  return <Package size={16} />;
};

const labelize = (value) => {
  const text = String(value || "pending").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

function OrderPage() {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [orderRows, productRows] = await Promise.all([
          fetchMyOrders(user?.userId),
          fetchProducts({ limit: 1000, sort: "-createdAt" }),
        ]);
        if (!mounted) return;
        setOrders(Array.isArray(orderRows) ? orderRows : []);
        setProducts(Array.isArray(productRows) ? productRows : []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (user?.userId) {
      load();
    } else {
      setOrders([]);
      setProducts([]);
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [user?.userId]);

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((item) => {
      map.set(asId(item?.id || item?._id), item);
    });
    return map;
  }, [products]);

  const rows = useMemo(() => {
    return [...orders].sort(
      (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
    );
  }, [orders]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-sm text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-600 mb-8">Track and manage your orders</p>

      {rows.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link
            to="/shoppage"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {rows.map((order) => {
            const orderId = asId(order?._id);
            const orderItems = Array.isArray(order?.items) ? order.items : [];
            const summary = order?.summary || {};

            return (
              <div key={orderId} className="bg-white rounded-xl shadow overflow-hidden">
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">Order #{orderId.slice(-8)}</span>
                        <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(order?.status)}`}>
                          {getStatusIcon(order?.status)}
                          {labelize(order?.status)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        Placed on {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                      </p>
                    </div>

                    <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600">
                      <Download size={16} />
                      Invoice
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {orderItems.map((item, idx) => {
                          const product = productMap.get(asId(item?.product));
                          return (
                            <div key={`${orderId}-${idx}`} className="flex items-center gap-4 p-3 border rounded-lg">
                              {product?.image ? (
                                <img src={product.image} alt={product?.name || "Product"} className="w-16 h-16 object-cover rounded" />
                              ) : (
                                <div className="w-16 h-16 rounded bg-slate-100" />
                              )}
                              <div className="flex-1">
                                <p className="font-medium">{product?.name || `Product ${asId(item?.product).slice(-6)}`}</p>
                                <p className="text-sm text-gray-500">Qty: {Number(item?.quantity || 0)} x {formatNaira(item?.price)}</p>
                              </div>
                              <span className="font-bold">{formatNaira(item?.total)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Order Summary</h3>
                      <div className="space-y-3 p-4 border rounded-lg">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{formatNaira(summary?.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>{formatNaira(summary?.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{formatNaira(summary?.tax)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                          <span className="font-bold">Total</span>
                          <span className="text-xl font-bold text-orange-600">
                            {formatNaira(summary?.total)}
                          </span>
                        </div>
                      </div>

                      {String(order?.status || "").toLowerCase() === "completed" && (
                        <div className="mt-5">
                          <Link
                            to={`/dispute/${orderId}`}
                            className="inline-flex rounded-lg border-2 border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            File Dispute
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderPage;
