// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState, useMemo } from 'react';

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
  totalAmount: number; // Add this line
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});

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

  const totalAmount = useMemo(() => {
    return Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

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