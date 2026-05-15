import { createContext } from 'react';
import type { Basket } from '../../type/types';

export interface BasketContextShape {
  basket: Basket | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  add: (foodItemId: number, quantity?: number) => Promise<void>;
  update: (cartItemId: number, quantity: number) => Promise<void>;
  remove: (cartItemId: number) => Promise<void>;
  clear: () => Promise<void>;
}

export const BasketContext = createContext<BasketContextShape | undefined>(undefined);
