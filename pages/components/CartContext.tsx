// components/CartContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type CartContextType = {
  cart: { [key: string]: number };
  addToCart: (code: string, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const addToCart = (code: string, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [code]: (prevCart[code] || 0) + quantity,
    }));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
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