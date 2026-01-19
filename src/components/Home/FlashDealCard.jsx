import React from 'react'

function FlashDealCard({product}) {
    const {imgUrl,name,price} = product
  return (
  <div className=' '>
      <div className=  ' bg-white border rounded-xl relative  shadow-xl duration-200 hover:translate-x-1  w-20  h-80 py-2 shadow-gray-400 md:w-48 px-1 object-contain bg-contain  border-orange-100 md:gap-2 cursor-pointer hover:transition hover:ease-in-out '>
         <img src={ imgUrl} alt="Product images" className='w-full h-48 object-cover object-center' />
        <h1 className='text-xl text-gray-900 font-mono font-bold ml-3 mt-3 '>{name}</h1>
        <p className='text-lg text-orange-700 font-bold ml-3 '>${price}</p>
    </div>
  </div>
  )
}

export default FlashDealCard