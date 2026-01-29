import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';


function Hero() {
  const [active,setActive] = useState('')
  return (
    <section className="relative w-full  sm:h-[380px] md:h-[100%] border-white  bg-[url('/images/bghero.jpg')] bg-contain object-contain bg-center mt-3   py-5 " >

      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-0 h-full flex items-center justify-center text-white ">
        <div className="max-w-xl px-6 text-center">
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Welcome to Elite Marketplace
          </h1>

          <p className="mt-4 text-base sm:text-lg">
            Discover amazing deals from verified sellers
          </p>
            <Link to="/shoppage">
            <button onClick={()=>setActive("shop")} className={`mt-6 px-6 py-3 rounded-full ${active === "shop" ?"bg-orange-700 text-white" :" bg-white text-orange-700"} `}>
            Shop Now
          </button>
            </Link>
         
        </div>
      </div>

    </section>
  );
}
export default Hero


