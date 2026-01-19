import React, { useContext } from 'react'
import ProductData from '../../components/Home/ProductData'
import products from '../../components/Data/Product'
import { Category } from '@mui/icons-material'
import FilterPanel from '../../components/Products/FilterPanel'
import SortBar from '../../components/Products/SortBar'
import ProductCard from '../../components/Home/ProductCard'
import { useState } from 'react'
import { AppContext } from '../../contexts/AppContext'



function ShopPage() {
    const [filter,setFilter] = useState({
    category:'All',
    price:1000,
     freeShipping: false,
    inStock: false,
    rating: 0,
    search: "",
    sort: "relevant"

    })
   const { addToCart } = useContext(AppContext);

    const filteredProduct = products.filter((p)=>filter.category === "All" || p.category === filter.category)
    .filter((p)=>p.price <= filter.price)
    .filter((p)=>!filter.freeShipping || p.freeShipping)
    .filter((p)=>!filter.inStock || p.inStock)
    .filter((p)=>p.rating >= filter.rating)
    .filter((p)=>p.name.toLowerCase().includes(filter.search.toLowerCase()))
    .sort((a,b)=>{
        if(filter.sort === "low") return a.price - b.price
        if(filter.sort === "High") return b.price - a.price
        return 0
    })
  return (
    <div className='flex gap-6 mt-6'>
      <FilterPanel filter={filter}  setFilter={setFilter} />
      <div className='flex-1'>
        <SortBar filter={filter} setFilter={setFilter} />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {filteredProduct.map((p)=>(
          <ProductCard key={p.id} product={p} addToCart={addToCart}  /> 
        ))}
      </div>
    </div>
  )
}

export default ShopPage