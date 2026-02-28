import { buildApiUrl } from "./api";
import localProducts from "../components/Data/Product";

const PRODUCT_CACHE_KEY = "product_cache_v1";
const PRODUCT_CACHE_MIGRATION_KEY = "product_cache_to_backend_migrated_v1";
const hasLocalStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const asId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (value === undefined || value === null) return fallback;
  return Boolean(value);
};

const getImage = (item = {}) => {
  if (item.image) return String(item.image);
  if (Array.isArray(item.images) && item.images[0]) return String(item.images[0]);
  return "";
};

const normalize = (item = {}) => {
  const sellerId = asId(item.sellerId || item.seller);
  const inventoryQty = toNumber(item?.inventory?.quantity, 0);

  return {
    ...item,
    id: asId(item.id || item._id),
    _id: asId(item._id || item.id),
    sellerId: sellerId || "unknown-seller",
    seller:
      item?.sellerName ||
      item?.seller?.name ||
      item?.seller?.storeName ||
      item?.seller ||
      "Unknown Seller",
    image: getImage(item),
    images: Array.isArray(item.images) && item.images.length ? item.images : getImage(item) ? [getImage(item)] : [],
    price: toNumber(item.price, 0),
    rating: toNumber(item.rating, 0),
    reviews: toNumber(item.reviews, 0),
    freeShipping: toBoolean(item.freeShipping, false),
    inStock: toBoolean(item.inStock, inventoryQty > 0),
    category: String(item.category || "Uncategorized"),
    description: String(item.description || ""),
  };
};

const readCachedProducts = () => {
  if (!hasLocalStorage) return [];
  try {
    const raw = localStorage.getItem(PRODUCT_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed?.items) ? parsed.items : [];
    return list.map(normalize);
  } catch (_) {
    return [];
  }
};

const writeCachedProducts = (items = []) => {
  if (!hasLocalStorage) return;
  try {
    localStorage.setItem(
      PRODUCT_CACHE_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        items,
      })
    );
  } catch (_) {
    // Ignore localStorage write errors to avoid breaking product browsing.
  }
};

const readMigrationFlag = () => {
  if (!hasLocalStorage) return false;
  try {
    return localStorage.getItem(PRODUCT_CACHE_MIGRATION_KEY) === "true";
  } catch (_) {
    return false;
  }
};

const writeMigrationFlag = (value) => {
  if (!hasLocalStorage) return;
  try {
    localStorage.setItem(PRODUCT_CACHE_MIGRATION_KEY, value ? "true" : "false");
  } catch (_) {
    // Ignore localStorage write errors.
  }
};

const productKey = (item = {}) => {
  const name = String(item?.name || "").trim().toLowerCase();
  const category = String(item?.category || "").trim().toLowerCase();
  const price = toNumber(item?.price, 0).toFixed(2);
  const sellerId = asId(item?.sellerId);
  return `${name}::${category}::${price}::${sellerId}`;
};

const sortProducts = (items = [], sort = "") => {
  const list = [...items];
  const key = String(sort || "");
  if (!key) return list;

  if (key === "-createdAt") {
    return list.sort(
      (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
    );
  }
  if (key === "createdAt") {
    return list.sort(
      (a, b) => new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime()
    );
  }

  return list;
};

const applyOptions = (items = [], options = {}) => {
  const { limit, sort } = options || {};
  const sorted = sortProducts(items, sort);
  const safeLimit = Number(limit);
  if (Number.isFinite(safeLimit) && safeLimit > 0) {
    return sorted.slice(0, safeLimit);
  }
  return sorted;
};

const requestProducts = async (path) => {
  const response = await fetch(buildApiUrl(path), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "Failed to load products");
  }
  return payload;
};

const isValidObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ""));

const toCreatePayload = (item = {}) => {
  const sellerId = asId(item?.sellerId);
  const image = getImage(item);
  const images =
    Array.isArray(item?.images) && item.images.length
      ? item.images.map((img) => String(img))
      : image
      ? [image]
      : [];

  const payload = {
    name: String(item?.name || "").trim(),
    description: String(item?.description || "").trim(),
    image,
    images,
    price: toNumber(item?.price, 0),
    category: String(item?.category || "").trim(),
    inventory: { quantity: toNumber(item?.inventory?.quantity ?? item?.quantity, 0) },
    status: String(item?.status || "active"),
  };

  if (isValidObjectId(sellerId)) {
    payload.sellerId = sellerId;
  }

  return payload;
};

const createProduct = async (item = {}) => {
  const response = await fetch(buildApiUrl("/products"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toCreatePayload(item)),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "Failed to create product");
  }
  return payload;
};

const migrateProductsToBackend = async (sourceItems = []) => {
  const normalized = sourceItems.map(normalize).filter((item) => String(item?.name || "").trim());
  if (!normalized.length) return false;

  const results = await Promise.allSettled(normalized.map((item) => createProduct(item)));
  const successCount = results.filter((result) => result.status === "fulfilled").length;
  if (successCount > 0) {
    writeMigrationFlag(true);
    return true;
  }
  return false;
};

const syncMissingProductsToBackend = async (sourceItems = [], backendItems = []) => {
  const normalizedSource = sourceItems.map(normalize).filter((item) => String(item?.name || "").trim());
  if (!normalizedSource.length) return false;

  const existingKeys = new Set(backendItems.map((item) => productKey(normalize(item))));
  const seen = new Set();
  const missing = [];

  for (const item of normalizedSource) {
    const key = productKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    if (!existingKeys.has(key)) {
      missing.push(item);
    }
  }

  if (missing.length === 0) {
    writeMigrationFlag(true);
    return false;
  }

  const results = await Promise.allSettled(missing.map((item) => createProduct(item)));
  const successCount = results.filter((result) => result.status === "fulfilled").length;
  if (successCount > 0) {
    writeMigrationFlag(true);
    return true;
  }
  return false;
};

const upsertProductInCache = (product) => {
  const cached = readCachedProducts();
  const id = asId(product?.id || product?._id);
  if (!id) return;
  const existsAt = cached.findIndex((item) => asId(item?.id) === id);
  if (existsAt >= 0) {
    cached[existsAt] = normalize({ ...cached[existsAt], ...product });
  } else {
    cached.unshift(normalize(product));
  }
  writeCachedProducts(cached);
};

export const fetchProducts = async (options = {}) => {
  const cached = readCachedProducts();
  const bundled = Array.isArray(localProducts) ? localProducts.map(normalize) : [];
  const migrationSource = [...cached, ...bundled];

  try {
    const payload = await requestProducts("/products");
    const items = Array.isArray(payload?.data) ? payload.data.map(normalize) : [];

    // Prefer backend data when present; sync missing local/cached records once.
    if (items.length > 0) {
      if (migrationSource.length > 0 && !readMigrationFlag()) {
        const synced = await syncMissingProductsToBackend(migrationSource, items);
        if (synced) {
          const refreshedPayload = await requestProducts("/products");
          const refreshedItems = Array.isArray(refreshedPayload?.data)
            ? refreshedPayload.data.map(normalize)
            : [];
          writeCachedProducts(refreshedItems);
          return applyOptions(refreshedItems, options);
        }
      }

      writeCachedProducts(items);
      return applyOptions(items, options);
    }

    if (migrationSource.length > 0) {
      const migrated = await migrateProductsToBackend(migrationSource);
      if (migrated) {
        const refreshedPayload = await requestProducts("/products");
        const refreshedItems = Array.isArray(refreshedPayload?.data)
          ? refreshedPayload.data.map(normalize)
          : [];
        if (refreshedItems.length > 0) {
          writeCachedProducts(refreshedItems);
          return applyOptions(refreshedItems, options);
        }
      }
    }

    if (cached.length > 0) {
      return applyOptions(cached, options);
    }

    return [];
  } catch (error) {
    if (cached.length > 0) {
      return applyOptions(cached, options);
    }
    throw new Error(error?.message || "Unable to load products");
  }
};

export const fetchProductById = async (id) => {
  const safeId = asId(id);
  if (!safeId) {
    throw new Error("Product not found");
  }

  try {
    const payload = await requestProducts(`/products/${safeId}`);
    const product = normalize(payload?.data || {});
    if (!product?.id) {
      throw new Error("Product not found");
    }
    upsertProductInCache(product);
    return product;
  } catch (error) {
    const cached = readCachedProducts();
    const product = cached.find((item) => asId(item.id) === safeId);
    if (product) return normalize(product);
    throw new Error(error?.message || "Product not found");
  }
};
