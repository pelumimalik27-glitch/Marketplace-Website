import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, addToCart }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden mt-5">
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative cursor-pointer"
      >
        <img src={product.image} className="w-full h-56 object-cover" />

        {product.hot && (
          <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full flex gap-1 items-center">
             Hot
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 text-orange-500 text-sm">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < product.rating ? "#f97316" : "none"} />
          ))}
          <span className="text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-orange-600 text-xl font-bold">${product.price}</span>
          {product.freeShipping && (
            <span className="border px-2 py-1 rounded-full text-xs">Free Shipping</span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full mt-3 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
