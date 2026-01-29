
import React from 'react'
import { Bar, Tooltip, XAxis, YAxis,BarChart,ResponsiveContainer } from 'recharts'

function OrderItemChart({data}) {
  return (
    <div className='bg-white p-4 rounded-xl shadow'>
    <h2 className='text-lg font-semibold mb-3'>Most Order Items</h2>
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
    <XAxis dataKey={"name"}/>
    <YAxis/>
    <Tooltip/>
    <Bar dataKey={"orders"}/>
    </BarChart >
    </ResponsiveContainer>
    </div>
  )
}

export default OrderItemChart