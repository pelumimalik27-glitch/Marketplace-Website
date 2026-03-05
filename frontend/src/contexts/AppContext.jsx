
import React, { createContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../lib/api";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  getValidAccessToken,
  saveSession,
} from "../lib/authSession";


const AppContext = createContext();

const AppProvider = ({ children }) => {
  const initialUser = getStoredUser();
  const initialToken = getAccessToken();
  const [isLogin, setIsLogin] = useState(Boolean(initialUser && initialToken));
  const [user, setUser] = useState(initialUser || null);
  const [authReady, setAuthReady] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState([
    { id: 1, name: "Sony Store", rating: 4.5, verified: true, products: 45 },
    { id: 2, name: "Apple Store", rating: 4.8, verified: true, products: 120 },
    { id: 3, name: "Urban Wears", rating: 4.2, verified: true, products: 89 },
    { id: 4, name: "Street Style", rating: 4.0, verified: false, products: 34 },
    { id: 5, name: "HomeGlow", rating: 4.6, verified: true, products: 56 },
    { id: 6, name: "ActiveFit", rating: 4.3, verified: true, products: 78 },
    { id: 7, name: "CoolAir", rating: 4.1, verified: false, products: 23 },
    { id: 8, name: "AutoCare", rating: 4.4, verified: true, products: 67 },
  ]);
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  
  const navigate = useNavigate();
  const searchRef = useRef();

  const handleLogin = ({ token, refreshToken, user }) => {
    const activeToken = token || getAccessToken();
    if (!activeToken) {
      return;
    }

    saveSession({
      accessToken: activeToken,
      refreshToken,
      user,
    });
    setIsLogin(true);
    setUser(user);
    setAuthReady(true);
   
  };

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await fetch(buildApiUrl("/auth/logout"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (_) {
      // Ignore logout API errors; local session is still cleared below.
    }

    setIsLogin(false);
    setUser(null);
    clearSession();
    navigate("/authpage");
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

useEffect(() => {
  let mounted = true;

  const bootstrapSession = async () => {
    try {
      const storedUser = getStoredUser();
      if (!storedUser) {
        if (!mounted) return;
        setIsLogin(false);
        setUser(null);
        clearSession();
        setAuthReady(true);
        return;
      }

      const token = await getValidAccessToken();
      if (!token) {
        if (!mounted) return;
        setIsLogin(false);
        setUser(null);
        clearSession();
        setAuthReady(true);
        return;
      }

      const latestUser = getStoredUser() || storedUser;
      if (!mounted) return;
      setUser(latestUser);
      setIsLogin(true);
      setAuthReady(true);
    } catch (_) {
      if (!mounted) return;
      clearSession();
      setIsLogin(false);
      setUser(null);
      setAuthReady(true);
    }
  };

  bootstrapSession();
  return () => {
    mounted = false;
  };
}, []);











  const addToCart = (product, quantity = 1, sellerId) => {
  setCart(prev => {
    const exist = prev.find(i => i.id === product.id && i.sellerId === sellerId);
    if (exist) {
      return prev.map(i =>
        i.id === product.id && i.sellerId === sellerId 
          ? { ...i, qty: i.qty + quantity }  
          : i
      );
    }
    return [...prev, { 
      ...product, 
      qty: quantity, 
      sellerId, 
      sellerName: product.seller 
    }];
  });
};

  const removeFromCart = (id) => {
  console.log('DEBUG removeFromCart:', id);
  setCart(prev => {
    const filtered = prev.filter(item => item.id !== id);
    console.log('DEBUG: After removal:', filtered);
    return filtered;
  });
};

  const updateQuantity = (id, newQty) => {
    console.log("updateQty:",id,newQty,cart);
    
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
  setCart(prev => {
    const updated = prev.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    );
    console.log('DEBUG: Updated cart:', updated);
    return updated;
  });
  };

  const clearCart = () => {
    setCart([]);
  };

  const groupCartBySeller = () => {
    return cart.reduce((groups, item) => {
      const sellerId = item.sellerId;
      if (!groups[sellerId]) {
        groups[sellerId] = {
          sellerId,
          sellerName: item.sellerName,
          items: [],
          shipping: item.freeShipping ? 0 : 9.99,
        };
      }
      groups[sellerId].items.push(item);
      return groups;
    }, {});
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      date: new Date().toLocaleString(),
      status: "Processing",
      subOrders: Object.values(groupCartBySeller()).map(sellerGroup => ({
        sellerId: sellerGroup.sellerId,
        sellerName: sellerGroup.sellerName,
        items: sellerGroup.items,
        status: "Pending",
        shipping: sellerGroup.shipping,
        total: sellerGroup.items.reduce((sum, item) => sum + (item.price * item.qty), 0) + sellerGroup.shipping,
      })),
    };
    
    setOrders(prev => [...prev, newOrder]);
    clearCart();
    return newOrder;
  };

  const fileDispute = (orderId, disputeData) => {
    const newDispute = {
      id: Date.now(),
      orderId,
      ...disputeData,
      status: "Open",
      date: new Date().toLocaleString(),
    };
    setDisputes(prev => [...prev, newDispute]);
    return newDispute;
  };

  return (
    <AppContext.Provider
      value={{
        isLogin,
        user,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        groupCartBySeller,
        searchTerm,
        handleSearch,
        searchRef,
        authReady,
        handleLogin,
        handleLogout,
        orders,
        placeOrder,
        sellers,
        disputes,
        fileDispute,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
