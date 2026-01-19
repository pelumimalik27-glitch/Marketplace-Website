import products from "../Data/Product";
import ProductCard from "./ProductCard";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

function ProductData() {
       const { addToCart,searchTerm } = useContext(AppContext);
          const filteredProduct = products.filter((item)=>(
         item.name.toLowerCase().includes(searchTerm) ||
         item.category.toLowerCase().includes(searchTerm)
        ))
  return (
    <div className="mt-8">
        <h1 className="text-black font-extrabold text-xl mb-1">Top Selling Product</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
      {filteredProduct.map(p => (
        <ProductCard key={p.id} product={p} addToCart={addToCart} />
      ))}
    </div>
    </div>
  )
}

export default ProductData