import { buildApiUrl } from "./api";
import { getValidAccessToken } from "./authSession";

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
    throw new Error(payload?.message || "Payment request failed");
  }
  return payload;
};

export const initializePayment = async (orderId, callbackPath = "/checkout/verify") => {
  const callbackUrl = `${window.location.origin}${callbackPath}`;
  return request("/payment/initialize", {
    method: "POST",
    body: JSON.stringify({ orderId, callbackUrl }),
  });
};

export const verifyPayment = async (reference) => {
  return request(`/payment/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
  });
};
