import React from 'react'
import { Warehouse } from 'lucide-react';

function Logo() {
  return (
    <div className='flex  gap-2 items-center ml-2'>
               <Warehouse className='text-orange-900  font-extrabold' />
             <h1 className='text-orange-700 font-extrabold text-lg '>Elite <br /><span className='text-gray-400 text-bold text-sm'>MarketPlace</span></h1>
    </div>
  )
}

export default Logo