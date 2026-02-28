import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from "./contexts/AppContext";

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
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';

// Seller Pages
import SellerLayout from './Pages/Seller/SellerLayout';
import SellerDashboard from './Pages/Seller/SellerDashboard';
import SellerOrders from './Pages/Seller/SellerOrders';
import SellerAnalytics from './Pages/Seller/SellerAnalytics';
import SellerPayouts from './Pages/Seller/SellerPayouts';
import SellerMessages from './Pages/Seller/SellerMessage';
import SellerSettings from './Pages/Seller/SellerSetting';
import SellerProducts from './Pages/Seller/SellerProduct';
import SellersCustomers from './Pages/Seller/SellerCustomers';




function App() {
  const { isLogin, user } = useContext(AppContext);
  const location = useLocation();

  const requireLogin = (element) => (
    isLogin ? (
      element
    ) : (
      <Navigate
        to="/authpage?mode=login"
        replace
        state={{
          redirectTo: `${location.pathname}${location.search}`,
          mode: "login",
        }}
      />
    )
  );

  return (
    <Routes>
   
      <Route path="/authpage" element={<AuthPage />} />
      <Route path="/login" element={<Navigate to="/authpage?mode=login" replace />} />
      <Route path="/register" element={<Navigate to="/authpage?mode=register" replace />} />
      
   
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={requireLogin(<ProductDetailPage />)} />
        <Route path="shoppage" element={<ShopPage />} />
      </Route>

   
      <Route path="/" element={<Layout />}>
        <Route 
          path="cart" 
          element={isLogin ? <CartPage /> : <Navigate to="/authpage?mode=login" replace state={{ redirectTo: "/cart", mode: "login" }} />} 
        />
        <Route 
          path="checkout" 
          element={isLogin ? <CheckoutPage /> : <Navigate to="/authpage?mode=login" replace state={{ redirectTo: "/checkout", mode: "login" }} />} 
        />
        <Route 
          path="orderpage" 
          element={isLogin ? <OrderPage /> : <Navigate to="/authpage?mode=login" replace state={{ redirectTo: "/orderpage", mode: "login" }} />} 
        />
        <Route 
          path="dispute/:orderId" 
          element={isLogin ? <DisputePage /> : <Navigate to="/authpage?mode=login" replace state={{ mode: "login" }} />} 
        />
      </Route>

    
<Route 
  path="/seller/*" 
   element={
    isLogin && user?.roles?.includes("seller") 
      ? <SellerLayout /> 
      : <Navigate to="/" replace />
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

<Route
  path="/admin/*"
  element={
    isLogin && user?.roles?.includes("admin")
      ? <AdminLayout />
      : <Navigate to="/authpage?mode=login&role=admin" replace state={{ mode: "login" }} />
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<AdminDashboard />} />
</Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
