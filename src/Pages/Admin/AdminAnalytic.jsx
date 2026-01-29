import React, { useContext } from 'react'
import { useCustomer } from '../../contexts/CustomerContext'
import { useOrder } from '../../contexts/OrderContext'

function AdminAnalytic() {
  const { orders,} = useOrder();
  const {customer,  updateCustomer} = useCustomer();
  const analytics = [
    {
      title:"Total Revenue",
      value:`${((orders.reduce((sum,o)=> sum + o.total,0) * 0.15).toFixed(2))}`,
      change:"+15.3% from last month"
    },
    {
       title:"Total Orders" ,
       value: orders.length,
       change:"+12.8% from last month"
    },
    {
      title:"Total Customers",
      value:customer?.length || 0,
      change:"+8.5% from last month"
       
    },
    {
      title:"Avg. Order Value",
      value:`$${ (orders.length ? ((orders.reduce((sum, o) => sum + o.total, 0)) /orders.length).toFixed(2):"0")}`,
        change:"+5.2% from last month"
    }
  ]
  return (
    <div>
       <div>
        <h1 className='text-black text-xl font-bold '>Analytics</h1>
        <p className='text-gray-500 text-sm'>Comprehensive marketplace performance metrics</p>
        </div> 

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
        {analytics.map((analyz, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{analyz.title}</p>
                <p className="text-2xl font-bold mt-2">{analyz.value}</p>
                <p className="text-sm mt-1 text-green-500">{analyz.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminAnalytic