import React from 'react'
import CategoryCard from './CategoryCard';

function ShopCategory() {
  const items = [
    { id:1, name: "Electronics", Qty: "4 items" },
    { id:2, name: "Fashion", Qty: "2 items" },
    { id:3, name: "Home & Gardeen", Qty: "2 items" }
  ];
 

  return (
    <div className=' mt-4  '>
      <h1 className="text-black text-2xl font-bold mb-6 ml-2">Shop By Category</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 ">
        {items.map(item => (
          <CategoryCard key={item.id} product={item}  />
        ))}
      </div>
    </div>
  );
}
export default ShopCategory