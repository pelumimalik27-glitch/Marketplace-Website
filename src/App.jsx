import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './contexts/AppContext';

// Layout Components
import Layout from './components/Layout/Layout';

// Pages
import HomePage from './Pages/Home/HomePage';
import AuthPage from './Pages/AuthPage';
import ShopPage from './Pages/Product/ShopPage';
import OrderPage from './Pages/Order/OrderPage';
import ProductDetailPage from './Pages/Product/ProductDetailPage';
import CartPage from './Pages/Cart/CartPage';
import CheckoutPage from './Pages/Checkout/CheckoutPage';
import DisputePage from './Pages/Dispute/DisputePage';

// Seller Pages
import SellerLayout from './Pages/Seller/SellerLayout';
import SellerDashboard from './Pages/Seller/SellerDashboard';
import SellerOrders from './Pages/Seller/SellerOrders';
import SellerAnalytics from './Pages/Seller/SellerAnalytics';
import SellerPayouts from './Pages/Seller/SellerPayouts';
import SellerMessages from './Pages/Seller/SellerMessage';
import SellerSettings from './Pages/Seller/SellerSetting';
import SellerProducts from './Pages/Seller/SellerProduct';

// Admin Pages
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminSellers from './Pages/Admin/AdminSellers';
import AdminDisputes from './Pages/Admin/AdminDisputes';
import SellersCustomers from './Pages/Seller/SellerCustomers';


function App() {
  const { isLogin, user } = useContext(AppContext);

  return (
    <Routes>
      {/* Auth Route */}
      <Route path="/authpage" element={<AuthPage />} />
      
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="shoppage" element={<ShopPage />} />
      </Route>

      {/* Protected Buyer Routes */}
      <Route path="/" element={<Layout />}>
        <Route 
          path="cart" 
          element={isLogin ? <CartPage /> : <Navigate to="/authpage" replace />} 
        />
        <Route 
          path="checkout" 
          element={isLogin ? <CheckoutPage /> : <Navigate to="/authpage" replace />} 
        />
        <Route 
          path="orderpage" 
          element={isLogin ? <OrderPage /> : <Navigate to="/authpage" replace />} 
        />
        <Route 
          path="dispute/:orderId" 
          element={isLogin ? <DisputePage /> : <Navigate to="/authpage" replace />} 
        />
      </Route>

      {/* Seller Routes */}
<Route 
  path="/seller/*" 
  element={
    isLogin && user?.role === 'seller' ? <SellerLayout /> : <Navigate to="/authpage" replace />
  }
>
  <Route index element={<SellerDashboard />} />
  <Route path="products" element={<SellerProducts />} />
  <Route path="orders" element={<SellerOrders />} />
  <Route path="analytics" element={<SellerAnalytics />} />
  <Route path="messages" element={<SellerMessages />} />
  <Route path="payouts" element={<SellerPayouts/>} />
  <Route path="customers" element={<SellersCustomers />} />
  <Route path="settings" element={<SellerSettings />} />
</Route>

      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          isLogin && user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/authpage" replace />
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="disputes" element={<AdminDisputes />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;