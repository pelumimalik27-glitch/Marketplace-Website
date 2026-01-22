import React from 'react'
import { Zap } from 'lucide-react';
import FlashDealCard from './FlashDealCard';
import { ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';




function FlashDeal() {  
const FlashProduct = [
  { id: 1, name: "Leather Travel Bag", imgUrl: "/images/bag.jpg", price: 189.99 },
  { id: 2, name: "Modern Lounge Chair", imgUrl: "/images/chair.jpg", price: 449.99 },
  { id: 3, name: "Wireless Bluetooth Earbuds", imgUrl: "/images/earpod.jpg", price: 279.99 },
  { id: 4, name: "Fashion Sunglasses", imgUrl: "/images/glass.jpg", price: 129.99 },
  { id: 5, name: "Smart Fitness Watch", imgUrl: "/images/smartwatch.jpg", price: 399.99 },
  { id: 6, name: "Premium Handbag", imgUrl: "/images/bag.jpg", price: 200.99 }
];


  const navigate = useNavigate()
     
  return (
   <div className='bg-orange-600 rounded-md  h-[100%] py-7 w-[100%] mt-8 pl-2 pr-2 border-white'>
     <div className='flex  items-center justify-between' >
      <div className='flex gap-2'>
           <Zap size={30} className='text-yellow-900 font-extrabold text-2xl' />
          <span>
            <h1 className='text-white font-extrabold '>Flash Deals</h1>
            <p  className='text-white font-extrabold'>Limited time offers</p>
        </span>
      </div>
      <button onClick={()=>navigate("/shoppage")} className='bg-white flex text-orange-700 items-center text-center px-5 rounded-md h-8 mr-2 hover:shadow-white'> Veiw All <span> <ChevronRight size={18} /></span></button>
    </div>
    <div className='flex justify-evenly items-center mt-3 '>
        {
          FlashProduct.length > 0 ?(
             FlashProduct.map((item)=>(
               <FlashDealCard key={item.id} product={item}  /> 
            ))
          ):(
             <p className='text-center text-gray-500 col-span-full font-sans font-bold text-2xl'>
            No Product(s) found
          </p>
          )
       
          
        }
    </div>
   </div>
  )
}

export default FlashDeal