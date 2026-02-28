import ProductCard from "./ProductCard";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { fetchProducts } from "../../lib/productApi";

function ProductData() {
  const { searchTerm } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const rows = await fetchProducts({ sort: "-createdAt" });
        if (!mounted) return;
        setProducts(Array.isArray(rows) ? rows : []);
      } catch (err) {
        if (!mounted) return;
        setProducts([]);
        setError(err?.message || "Failed to load products");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProduct = useMemo(() => {
    const keyword = String(searchTerm || "").toLowerCase();
    if (!keyword) return products;
    return products.filter((item) => {
      const name = String(item?.name || "").toLowerCase();
      const category = String(item?.category || "").toLowerCase();
      return name.includes(keyword) || category.includes(keyword);
    });
  }, [products, searchTerm]);

  return (
    <div className="mt-12">
      <h1 className="text-black font-extrabold text-xl mb-1">Top Selling Product</h1>
      {isLoading && <p className="mt-4 text-sm text-gray-500">Loading products...</p>}
      {error && !isLoading && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {!isLoading && !error && filteredProduct.length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No products found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProduct.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default ProductData
