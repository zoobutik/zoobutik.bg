import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  itemCount: number;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: Product[] };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
} | null>(null);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return state; // Item already in wishlist
      }
      
      const newItems = [...state.items, action.payload];
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      
      return {
        ...state,
        items: newItems,
        itemCount: newItems.length
      };
    }
    
    case 'CLEAR_WISHLIST':
      localStorage.removeItem('wishlist');
      return {
        items: [],
        itemCount: 0
      };
    
    case 'LOAD_WISHLIST':
      return {
        items: action.payload,
        itemCount: action.payload.length
      };
    
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    itemCount: 0
  });

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const items = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: items });
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  }, []);

  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};