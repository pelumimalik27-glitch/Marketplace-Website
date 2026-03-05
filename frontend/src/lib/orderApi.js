import { buildApiUrl } from "./api";
import { getValidAccessToken } from "./authSession";

const asId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const getHeaders = async () => {
  const token = await getValidAccessToken().catch(() => "");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (path, options = {}) => {
  const headers = await getHeaders();
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "Order request failed");
  }
  return payload;
};

export const createOrder = async (payload) => {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const fetchMyOrders = async (userId = "") => {
  const payload = await request("/orders");
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  if (!userId) return rows;
  return rows.filter((row) => asId(row?.buyer) === String(userId));
};
