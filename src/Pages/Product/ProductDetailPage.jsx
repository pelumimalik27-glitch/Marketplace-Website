import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, Shield, ChevronLeft, Heart } from 'lucide-react';
import products from '../../components/Data/Product';
import { AppContext } from '../../contexts/AppContext';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);
  
  const product = products.find(p => p.id === parseInt(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  if (!product) {
    return (
      <div className="p-8 text-center ">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <button 
          onClick={() => navigate('/shoppage')}
          className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
      >
        <ChevronLeft size={20} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-96 object-contain rounded-lg"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {[product.image, ...(product.image || [])].slice(0, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                  selectedImage === idx ? 'border-orange-500' : 'border-gray-300'
                }`}
              >
                <img src={img} alt={`Product view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-gray-500">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < Math.floor(product.rating) ? 'text-orange-500 fill-orange-500' : 'text-gray-300'}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
              </div>
              <span className="text-green-600 font-semibold">In Stock</span>
            </div>
            
            <div className="mt-4">
              <span className="text-4xl font-bold text-orange-600">${product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            
            <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck size={18} />
                <span>{product.freeShipping ? 'Free Shipping' : 'Shipping: $9.99'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span>30-Day Return Policy</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Sold by: {product.seller}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.5 (1.2k reviews)</span>
                </div>
              </div>
              <button className="text-orange-600 hover:text-orange-700 font-medium">
                Visit Store
              </button>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => addToCart(product, product.sellerId || 1)}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium"
              >
                Add to Cart
              </button>
              <button className="p-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50">
                <Heart size={24} />
              </button>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-medium">
              Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-600">
              {product.description || 'No description available. This is a high-quality product from a trusted seller.'}
            </p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-xl transition p-4">
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-lg" />
                <h3 className="font-semibold mt-3">{p.name}</h3>
                <p className="text-orange-600 font-bold">${p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;