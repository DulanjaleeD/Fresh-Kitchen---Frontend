import { useEffect, useState } from 'react';
import type { Order, PaymentStatus } from '../type/types';
import { useSession } from '../state/auth/useSession';
import { useBasket } from '../state/basket/useBasket';
import { orderGateway } from '../infra/services/orderGateway';
import { paymentGateway } from '../infra/services/paymentGateway';
import { basketTotal } from '../utils/totals';

export function PurchasePage() {
  const { user } = useSession();
  const { basket, refresh } = useBasket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const rows = await orderGateway.byUser(user.id);
      const merged = await Promise.all(
        rows.map(async (order) => {
          if (order.payment) return order;
          try {
            const payment = await paymentGateway.byOrder(order.id);
            return { ...order, payment };
          } catch {
            return order;
          }
        }),
      );
      setOrders(merged);
    } catch {
      setError('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void loadOrders();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const placeOrder = async () => {
    if (!user?.id) return;
    setBusy(true);
    setError('');
    try {
      const order = await orderGateway.checkout(user.id);
      const payment = await paymentGateway.createPending(order.id);
      setOrders((prev) => [{ ...order, payment }, ...prev]);
      await refresh();
    } catch {
      setError('Checkout failed.');
    } finally {
      setBusy(false);
    }
  };

  const updatePayment = async (order: Order, status: PaymentStatus) => {
    if (!order.payment?.id) return;
    setError('');
    try {
      const updated = await paymentGateway.updateStatus(order.payment.id, status);
      setOrders((prev) => prev.map((row) => (row.id === order.id ? { ...row, payment: updated } : row)));
    } catch {
      setError('Unable to update payment status.');
    }
  };

  return (
    <section className="grid gap-4.5">
      <h1>Checkout & Orders</h1>
      {error && <div className="border border-red-200 bg-red-50 text-red-900 rounded-2xl p-3">{error}</div>}

      <div className="border border-gray-200 rounded-2xl bg-white p-4 flex justify-between items-center gap-4 md:flex-col md:items-start">
        <div>
          <p>Items in basket: {basket?.items.length ?? 0}</p>
          <strong>Basket total: ${basketTotal(basket).toFixed(2)}</strong>
        </div>
        <button className="rounded-lg border border-indigo-500 px-3 py-1.5 cursor-pointer bg-indigo-500 text-white no-underline transition-colors disabled:opacity-60 disabled:cursor-not-allowed" disabled={busy || !(basket?.items.length ?? 0)} onClick={placeOrder}>
          {busy ? 'Processing…' : 'Place order'}
        </button>
      </div>

      {loading ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-4">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-4">No orders yet.</div>
      ) : (
        <div className="grid gap-3.5">
          {orders.map((order) => (
            <article key={order.id} className="border border-gray-200 rounded-2xl bg-white p-4">
              <header className="flex justify-between gap-2">
                <h3 className="m-0">Order #{order.id}</h3>
                <span>{order.status}</span>
              </header>
              <ul className="m-0 pl-4">
                {order.orderItems.map((item) => (
                  <li key={item.id}>
                    {item.foodItem.name} × {item.quantity} (${(item.unitPrice * item.quantity).toFixed(2)})
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
              </p>
              <p>Payment: {order.payment?.status ?? 'N/A'}</p>
              {order.payment?.status === 'PENDING' && (
                <div className="flex gap-2.5 items-center">
                  <button className="rounded-lg border border-indigo-500 px-3 py-1.5 cursor-pointer bg-indigo-500 text-white no-underline transition-colors" onClick={() => updatePayment(order, 'COMPLETED')}>
                    Mark paid
                  </button>
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 cursor-pointer text-red-700 bg-red-50" onClick={() => updatePayment(order, 'FAILED')}>
                    Mark failed
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
