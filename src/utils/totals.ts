import type { Basket } from '../type/types';

export function basketTotal(basket: Basket | null): number {
  const items = basket?.items ?? [];
  return items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
}
