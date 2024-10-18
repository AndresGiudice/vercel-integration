// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the type for your props
interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  cart: { [key: string]: number };
  addToCart: (product: string, quantity: number) => void;
  clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const addToCart = (product: string, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [product]: (prevCart[product] || 0) + quantity,
    }));
  };

  const clearCart = () => {
    setCart({});
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
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