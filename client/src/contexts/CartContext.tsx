import React, { useState, useEffect } from 'react';
import { useGetProductsQuery } from '../app/api';

interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, title: string, price: number, image?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (productId: string, title: string, price: number, image?: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === productId);
      if (existingItem) {
        return prevItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { productId, title, price, quantity: 1, image }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
