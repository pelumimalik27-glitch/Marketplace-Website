import React, { createContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
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

  const handleLogin = (userData) => {
    localStorage.setItem("userToken", userData.token);
    localStorage.setItem("userRole", userData.role);
    setUser(userData);
    setIsLogin(true);
    setUsername(userData.username);
    navigate(userData.role === 'admin' ? '/admin' : userData.role === 'seller' ? '/seller' : '/');
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    setIsLogin(false);
    setUser(null);
    setUsername("");
    navigate("/authpage");
  };

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const addToCart = (product, sellerId) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id && i.sellerId === sellerId);
      if (exist) {
        return prev.map(i =>
          i.id === product.id && i.sellerId === sellerId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1, sellerId, sellerName: product.seller }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    ));
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

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    if (token) {
      setIsLogin(true);
      setUser({ role });
      setUsername("User");
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLogin,
        user,
        username,
        setUsername,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        groupCartBySeller,
        searchTerm,
        handleSearch,
        searchRef,
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