// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CartProviderProps {
  children: ReactNode;
}

interface CartItem {
  quantity: number;
  description: string;
  price: number; // Add this line
}

interface CartContextType {
  cart: { [key: string]: CartItem };
  addToCart: (product: string, quantity: number, description: string, price: number) => void;
  removeItem: (product: string) => void;
  clearCart: () => void;
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
        price, // Añadir esta línea
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

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, clearCart }}>
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