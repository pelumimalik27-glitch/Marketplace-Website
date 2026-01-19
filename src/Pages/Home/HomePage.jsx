import React from 'react'
import FlashDeal from '../../components/Home/FlashDeal'
import Hero from '../../components/Home/Hero'
import ShopCategory from '../../components/Home/ShopCategory'



function HomePage() {
  return (
    <div className="min-h-screen">
       
      <Hero/>
      <ShopCategory/>
      <FlashDeal/>
    </div>
  )
}

export default HomePage