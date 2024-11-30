// components/CartContext.tsx
import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

type CartItem = {
  product: string;
  quantity: number;
  price: number;
  code: string;
  description: string;
  discounted: boolean; // Added discounted property
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

  const calculateDiscountedPrice = (code: string, quantity: number, price: number) => {
    if (code.includes('FB3') && quantity >= 100) {
      return price * 0.9;
    }
    return price;
  };

  const addToCart = (systemCode: string, quantity: number, description: string, price: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      const key = `${systemCode}-${description}-${price}`;
      if (newCart[key]) {
        newCart[key].quantity += quantity;
      } else {
        newCart[key] = { product: description, quantity, price, code: systemCode, description, discounted: false };
      }

      // Apply discount if total quantity of FB3 products reaches 100
      const totalFB3Quantity = Object.values(newCart).reduce((acc, item) => {
        return item.code.includes('FB3') ? acc + item.quantity : acc;
      }, 0);

      if (totalFB3Quantity >= 100) {
        Object.values(newCart).forEach(item => {
          if (item.code.includes('FB3') && !item.discounted) {
            item.price = calculateDiscountedPrice(item.code, totalFB3Quantity, item.price);
            item.discounted = true;
          }
        });
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