const MAIL_BASE_URL = (process.env.MESSAGE_SERVICE_URL || "http://localhost:7000").replace(/\/+$/, "");

const normalizePath = (path = "") => {
  const safePath = String(path || "").trim();
  if (!safePath) return "/api/v1/mail";
  return safePath.startsWith("/") ? `/api/v1/mail${safePath}` : `/api/v1/mail/${safePath}`;
};

const requestMailService = async (path, payload = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`${MAIL_BASE_URL}${normalizePath(path)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || `Mail service request failed with status ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

const notifyWelcome = async ({ email, name }) => requestMailService("/welcome", { email, name });
const notifyLoginAlert = async ({ email, name }) => requestMailService("/login-alert", { email, name });
const notifySellerApproval = async ({ email, name }) =>
  requestMailService("/seller-approval", { email, name });

module.exports = {
  notifyWelcome,
  notifyLoginAlert,
  notifySellerApproval,
};
