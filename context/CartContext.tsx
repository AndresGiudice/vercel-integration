// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

type CartItem = {
  product: string;
  quantity: number;
  price: number;
  originalPrice: number; // Added originalPrice property
  code: string;
  description: string;
  discounted: boolean;
};

type CartContextType = {
  cart: { [key: string]: CartItem };
  addToCart: (systemCode: string, quantity: number, description: string, price: number) => void;
  removeItem: (product: string) => void;
  clearCart: () => void;
  totalAmount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateDiscountedPrice = (code: string, quantity: number, originalPrice: number) => {
    if ((code.includes('FB3') || code.includes('FM3')) && quantity >= 100) {
      return originalPrice * 0.9;
    }
    return originalPrice;
  };

  const recalculateDiscounts = (cart: { [key: string]: CartItem }) => {
    const totalFB3FM3Quantity = Object.values(cart).reduce((acc, item) => {
      return (item.code.includes('FB3') || item.code.includes('FM3')) ? acc + item.quantity : acc;
    }, 0);

    const newCart = { ...cart };
    Object.keys(newCart).forEach(key => {
      const item = newCart[key];
      if (item.code.includes('FB3') || item.code.includes('FM3')) {
        newCart[key] = {
          ...item,
          price: calculateDiscountedPrice(item.code, totalFB3FM3Quantity, item.originalPrice),
          discounted: totalFB3FM3Quantity >= 100
        };
      }
    });

    return newCart;
  };

  const addToCart = (systemCode: string, quantity: number, description: string, price: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const key = `${systemCode}-${description}-${price}`;
      if (newCart[key]) {
        newCart[key].quantity += quantity;
      } else {
        newCart[key] = { product: description, quantity, price, originalPrice: price, code: systemCode, description, discounted: false };
      }

      return recalculateDiscounts(newCart);
    });
  };

  const removeItem = (product: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[product];
      return recalculateDiscounts(newCart);
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const totalAmount = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};