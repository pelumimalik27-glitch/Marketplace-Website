import { buildApiUrl } from "./api";

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("userToken");
  return {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const request = async (path, options = {}) => {
  const isFormData = typeof FormData !== "undefined" && options?.body instanceof FormData;
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      ...getAuthHeaders(isFormData),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }
  return payload;
};

const asId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

export const fetchMySellerProfile = async (userId) => {
  const payload = await request("/seller");
  const sellers = Array.isArray(payload?.data) ? payload.data : [];
  if (!userId) return sellers[0] || null;
  return sellers.find((seller) => asId(seller.user) === String(userId)) || null;
};

export const fetchSellerProducts = async (sellerId) => {
  const payload = await request("/products");
  const products = Array.isArray(payload?.data) ? payload.data : [];
  if (!sellerId) return products;
  return products.filter((product) => asId(product.sellerId) === String(sellerId));
};

export const becomeSeller = async (payload) => {
  return request("/auth/upgrade-to-seller", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const fetchSellerApplicationStatus = async () => {
  return request("/auth/seller-application");
};

export const createSellerProduct = async (payload) => {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateSellerProduct = async (productId, payload) => {
  return request(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteSellerProduct = async (productId) => {
  return request(`/products/${productId}`, {
    method: "DELETE",
  });
};

export const fetchSellerOrders = async (sellerId) => {
  const payload = await request("/orders");
  const orders = Array.isArray(payload?.data) ? payload.data : [];
  if (!sellerId) return orders;

  return orders.filter((order) => {
    if (!Array.isArray(order.items)) return false;
    return order.items.some((item) => asId(item.seller) === String(sellerId));
  });
};

export const updateOrderStatus = async (orderId, payload) => {
  return request(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const fetchCategories = async () => {
  return request("/categories");
};

export const fetchConversations = async () => {
  const payload = await request("/conversations");
  return Array.isArray(payload?.data) ? payload.data : [];
};

export const fetchConversationsByUser = async (userId = "") => {
  const conversations = await fetchConversations();
  if (!userId) return conversations;
  return conversations.filter((conversation) => {
    const participants = Array.isArray(conversation?.participants)
      ? conversation.participants
      : [];
    return participants.some((participant) => asId(participant) === String(userId));
  });
};

export const fetchConversationMessages = async (conversationId = "") => {
  const payload = await request("/messages");
  const messages = Array.isArray(payload?.data) ? payload.data : [];
  const filtered = !conversationId
    ? messages
    : messages.filter((message) => asId(message.conversationId) === String(conversationId));
  return filtered.sort(
    (a, b) =>
      new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime()
  );
};

export const sendConversationMessage = async (conversationId, senderId, content) => {
  return request("/messages", {
    method: "POST",
    body: JSON.stringify({ conversationId, senderId, content }),
  });
};

export const createConversation = async (participants = [], lastMessage = "") => {
  return request("/conversations", {
    method: "POST",
    body: JSON.stringify({ participants, lastMessage }),
  });
};

export const updateConversation = async (conversationId, payload) => {
  return request(`/conversations/${conversationId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const updateSellerProfile = async (sellerId, payload) => {
  return request(`/seller/${sellerId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};
