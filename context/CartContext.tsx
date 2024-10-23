// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

interface CartProviderProps {
  children: ReactNode;
}

interface CartItem {
  quantity: number;
  description: string;
  price: number;
}

interface CartContextType {
  cart: { [key: string]: CartItem };
  addToCart: (product: string, quantity: number, description: string, price: number) => void;
  removeItem: (product: string) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
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

  const addToCart = (product: string, quantity: number, description: string, price: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product]: {
        quantity: (prevCart[product]?.quantity || 0) + quantity,
        description,
        price,
      },
    }));
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

  const totalAmount = Object.values(cart).reduce((acc, { quantity, price }) => acc + quantity * price, 0);

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

export { CartProvider, CartContext };