const products = [
  {
    id: 1,
    name: "PlayStation 3 Slim Console",
    price: 399.99,
    category: "Electronics",
    rating: 4.5,
    reviews: 312,
    freeShipping: true,
    inStock: true,
    seller: "Sony Store",
    sellerId: 1,
    image: "/src/assets/PS 3.jpg",
    description: "The PlayStation 3 Slim Console delivers high-definition gaming with advanced graphics and multimedia capabilities.",
    specs: {
      brand: "Sony",
      model: "PS3 Slim",
      storage: "250GB",
      color: "Black"
    }
  },
  {
    id: 2,
    name: "iPhone 13 Pro Max",
    price: 279.99,
    category: "Electronics",
    rating: 4.8,
    reviews: 234,
    freeShipping: true,
    inStock: true,
    seller: "Apple Store",
    sellerId: 2,
    image: "/src/assets/iphone.jpg",
    description: "Latest iPhone with Pro camera system, A15 Bionic chip, and Super Retina XDR display.",
    specs: {
      brand: "Apple",
      storage: "256GB",
      color: "Sierra Blue",
      network: "5G"
    }
  },
  {
    id: 3,
    name: "Men's Casual Sneakers",
    price: 159.99,
    category: "Fashion",
    rating: 4.2,
    reviews: 198,
    freeShipping: true,
    inStock: true,
    seller: "Urban Wears",
    sellerId: 3,
    image: "/src/assets/shoes.jpg",
    description: "Comfortable casual sneakers with premium leather and cushioned insoles.",
    specs: {
      brand: "UrbanWear",
      material: "Leather",
      size: "Available 7-13",
      color: "White/Black"
    }
  },
  {
    id: 4,
    name: "Unisex Cotton Hoodie",
    price: 349.99,
    category: "Fashion",
    rating: 4.0,
    reviews: 287,
    freeShipping: false,
    inStock: true,
    seller: "Street Style",
    sellerId: 4,
    image: "/src/assets/cloth.jpg",
    description: "Premium cotton hoodie with kangaroo pocket and adjustable drawstring hood.",
    specs: {
      brand: "StreetStyle",
      material: "100% Cotton",
      sizes: "S-XXL",
      colors: "Black, Gray, Navy"
    }
  },
  {
    id: 5,
    name: "Modern Table Lamp",
    price: 259.99,
    category: "Home & Garden",
    rating: 4.6,
    reviews: 201,
    freeShipping: false,
    inStock: true,
    seller: "HomeGlow",
    sellerId: 5,
    image: "/src/assets/lamp.jpg",
    description: "Contemporary table lamp with dimmable LED and touch control.",
    specs: {
      brand: "HomeGlow",
      power: "10W LED",
      height: "18 inches",
      material: "Ceramic"
    }
  },
  {
    id: 6,
    name: "Sports Running Sneakers",
    price: 139.99,
    category: "Fashion",
    rating: 4.3,
    reviews: 176,
    freeShipping: true,
    inStock: true,
    seller: "ActiveFit",
    sellerId: 6,
    image: "/src/assets/shoes.jpg",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh.",
    specs: {
      brand: "ActiveFit",
      type: "Running",
      weight: "280g",
      colors: "Multiple"
    }
  },
  {
    id: 7,
    name: "Rechargeable Standing Fan",
    price: 429.99,
    category: "Home & Garden",
    rating: 4.1,
    reviews: 351,
    freeShipping: true,
    inStock: true,
    seller: "CoolAir",
    sellerId: 7,
    image: "/src/assets/fans.jpg",
    description: "Portable rechargeable fan with 3 speed settings and 8-hour battery life.",
    specs: {
      brand: "CoolAir",
      power: "Rechargeable",
      runtime: "8 hours",
      speeds: "3"
    }
  },
  {
    id: 8,
    name: "Car Interior Accessories Set",
    price: 299.99,
    category: "Electronics",
    rating: 4.4,
    reviews: 187,
    freeShipping: false,
    inStock: true,
    seller: "AutoCare",
    sellerId: 8,
    image: "/src/assets/caracces.jpg",
    description: "Complete car interior accessory kit including mats, organizers, and cleaners.",
    specs: {
      brand: "AutoCare",
      items: "12 pieces",
      material: "Premium",
      fit: "Universal"
    }
  },
  {
    id: 9,
    name: "Wireless Gaming Headset",
    price: 129.99,
    category: "Electronics",
    rating: 4.7,
    reviews: 89,
    freeShipping: true,
    inStock: false,
    seller: "Sony Store",
    sellerId: 1,
    image: "/src/assets/headset.jpg",
    description: "Wireless gaming headset with 7.1 surround sound and noise cancellation.",
    specs: {
      brand: "GamingPro",
      battery: "20 hours",
      connectivity: "Bluetooth 5.0",
      mic: "Detachable"
    }
  },
  {
    id: 10,
    name: "Mouse",
    price: 49.99,
    category: "Sports",
    rating: 4.5,
    reviews: 156,
    freeShipping: true,
    inStock: true,
    seller: "ActiveFit",
    sellerId: 6,
    image: "/src/assets/mouse.jpg",
    description: "Non-slip yoga mat with carrying strap and alignment lines.",
    specs: {
      brand: "YogaLife",
      thickness: "6mm",
      material: "Eco-friendly TPE",
      size: "72 x 24 inches"
    }
  },
 {
  id: 11,
  name: "Electric Coffee Grinder",
  price: 129.99,
  category: "Home Appliances",
  rating: 4.7,
  reviews: 89,
  freeShipping: true,
  inStock: false,
  seller: "Sony Store",
  sellerId: 1,
  image: "/src/assets/grinder.jpg",
  description: "High-performance electric coffee grinder with stainless steel blades for fast and even grinding.",
  specs: {
    brand: "KitchenPro",
    power: "200W",
    capacity: "80g",
    material: "Stainless Steel",
    usage: "Coffee beans, spices"
  }
},
{
  id: 12,
  name: "Double Door Refrigerator",
  price: 499.99,
  category: "Home Appliances",
  rating: 4.5,
  reviews: 156,
  freeShipping: true,
  inStock: true,
  seller: "ActiveFit",
  sellerId: 6,
  image: "/src/assets/fridge.jpg",
  description: "Energy-efficient double door refrigerator with large storage capacity and fast cooling technology.",
  specs: {
    brand: "CoolMax",
    capacity: "250 Liters",
    energyRating: "A+",
    coolingType: "Frost Free",
    color: "Silver"
  }
}

];

export default products;