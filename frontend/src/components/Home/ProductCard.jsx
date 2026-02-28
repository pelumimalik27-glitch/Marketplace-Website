import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { AppContext } from "../../contexts/AppContext";
import { useContext } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isLogin } = useContext(AppContext);

  const handleProductClick = () => {
    if (!isLogin) {
      navigate("/authpage?mode=login", {
        state: { 
          redirectTo: `/product/${product.id}`, // Fixed: redirectTo not redirectaTo
          mode: "login",
          message: "Please login to view product details" 
        }
      });
      return;
    }
    navigate(`/product/${product.id}`); // Only navigate to product if logged in
  };

  const handleAddToCart = () => {
    if (!isLogin) {
      navigate("/authpage?mode=login", {
        state: { 
          redirectTo: `/product/${product.id}`, // Fixed: redirectTo not redirectaTo
          mode: "login",
          message: "Please login to add items to cart" 
        }
      });
      return;
    }
    addToCart(product);
  };

  return (
    <div
      onClick={handleProductClick}
      className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden mt-5 cursor-pointer"
    >
      <div className="relative">
        <img src={product.image} className="w-full h-56 object-cover" />
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
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="w-full mt-3 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
