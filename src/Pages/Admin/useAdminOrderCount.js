function useAdminOrderCount() {
  const { orders } = useOrder();

  const itemCount = {};

  orders.forEach(order => {
    order.items.forEach(item => {
      if (!itemCount[item.name]) {
        itemCount[item.name] = 0;
      }
      itemCount[item.name] += item.qty;
    });
  });

  const chartData = Object.keys(itemCount).map(item => ({
    name: item,
    orders: itemCount[item]
  }));

  return chartData;
}
export default useAdminOrderCount;
