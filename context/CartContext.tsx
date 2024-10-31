// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

interface CartProviderProps {
  children: ReactNode;
}

interface CartItem {
  product: string; // Añadido
  quantity: number;
  description: string;
  price: number;
  systemCode?: string;
}

interface CartContextType {
  cart: { [key: string]: CartItem };
  addToCart: (product: string, quantity: number, description: string, price: number, systemCode: string) => void;
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

  const addToCart = (product: string, quantity: number, description: string, price: number, systemCode: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [systemCode]: {
        product, // Asegúrate de pasar el producto aquí
        quantity: (prevCart[systemCode]?.quantity || 0) + quantity,
        description,
        price,
        systemCode,
      },
    }));
  };

  const removeItem = (systemCode: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[systemCode];
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