import { useEffect, useState, type ReactNode } from 'react';
import { basketGateway } from '../../infra/services/basketGateway';
import { useSession } from '../auth/useSession';
import type { Basket } from '../../type/types';
import { BasketContext } from './BasketContext';

export function BasketProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useSession();
  const [basket, setBasket] = useState<Basket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    if (!isAuthenticated || !user?.id) {
      setBasket(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const next = await basketGateway.fetch(user.id);
      setBasket(next);
    } catch {
      setError('Unable to load basket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const add = async (foodItemId: number, quantity = 1) => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      setBasket(await basketGateway.add(user.id, foodItemId, quantity));
    } catch {
      setError('Unable to add item.');
    } finally {
      setLoading(false);
    }
  };

  const update = async (cartItemId: number, quantity: number) => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      setBasket(await basketGateway.update(user.id, cartItemId, quantity));
    } catch {
      setError('Unable to update quantity.');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (cartItemId: number) => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      setBasket(await basketGateway.remove(user.id, cartItemId));
    } catch {
      setError('Unable to remove item.');
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      setBasket(await basketGateway.clear(user.id));
    } catch {
      setError('Unable to clear basket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasketContext.Provider value={{ basket, loading, error, refresh, add, update, remove, clear }}>
      {children}
    </BasketContext.Provider>
  );
}
