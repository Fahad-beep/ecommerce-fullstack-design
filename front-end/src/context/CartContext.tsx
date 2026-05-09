import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from '../api/products.api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartFeedback {
  id: number;
  product: Product;
  quantity: number;
  totalQuantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  lastAdded: CartFeedback | null;
  addToCart: (product: Product, quantity?: number) => void;
  dismissLastAdded: () => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'ecommerce-cart';

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<CartFeedback | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.product._id === product._id);
      if (!existing) {
        setLastAdded({
          id: Date.now(),
          product,
          quantity,
          totalQuantity: quantity,
        });
        return [...currentItems, { product, quantity }];
      }

      const totalQuantity = existing.quantity + quantity;
      setLastAdded({
        id: Date.now(),
        product,
        quantity,
        totalQuantity,
      });

      return currentItems.map((item) =>
        item.product._id === product._id
          ? { ...item, quantity: totalQuantity }
          : item,
      );
    });
  };

  const dismissLastAdded = () => {
    setLastAdded(null);
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product._id !== productId),
    );
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        lastAdded,
        addToCart,
        dismissLastAdded,
        removeFromCart,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error('useCart must be used within CartProvider');
  }

  return value;
};
