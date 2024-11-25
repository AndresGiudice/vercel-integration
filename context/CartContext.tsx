// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

type CartItem = {
  product: string;
  quantity: number;
  price: number;
  systemCode: string; // Changed from code to systemCode
  description: string;
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

  const addToCart = (systemCode: string, quantity: number, description: string, price: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const key = `${systemCode}-${description}-${price}`;
      if (newCart[key]) {
        newCart[key].quantity += quantity;
      } else {
        newCart[key] = { product: description, quantity, price, systemCode, description }; // Changed from code to systemCode
      }
      return newCart;
    });
  };

  const removeItem = (product: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[product];
      return newCart;
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