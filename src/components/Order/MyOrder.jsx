
import { useOrder } from "../contexts/OrderContext";

export default function MyOrders() {
  const { orders } = useOrder();

  return (
    <div>
    <h2>
       My Orders 
    </h2>
      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map(o => (
        <div key={o.id} className="border p-3 my-2">
          <p><b>{o.customer.name}</b> — ₦{o.total}</p>
          <p>Status: {o.status}</p>
          <p>Date: {o.date}</p>
        </div>
      ))}
    </div>
  );
}
