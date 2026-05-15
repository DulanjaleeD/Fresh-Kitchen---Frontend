import { Link } from 'react-router';
import { useBasket } from '../state/basket/useBasket';
import { basketTotal } from '../utils/totals';

export function BasketPage() {
  const { basket, loading, error, update, remove, clear } = useBasket();
  const items = basket?.items ?? [];

  if (loading) return <div className="border border-gray-200 rounded-2xl bg-white p-4">Loading basket…</div>;

  return (
    <section className="grid gap-4.5">
      <h1>Basket Workspace</h1>
      {error && <div className="border border-red-200 bg-red-50 text-red-900 rounded-2xl p-3">{error}</div>}

      {items.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-4">
          <p>Your basket is empty.</p>
          <Link className="text-indigo-500" to="/">Browse menu</Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3.5">
            {items.map((item) => (
              <article key={item.id} className="border border-gray-200 rounded-2xl bg-white p-4 flex justify-between items-center gap-4 md:flex-col md:items-start">
                <div>
                  <h3 className="m-0">{item.foodItem.name}</h3>
                  <small>{item.foodItem.category?.name || 'Uncategorized'}</small>
                </div>
                <div className="flex items-center gap-1">
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 cursor-pointer bg-white min-w-8 disabled:opacity-60 disabled:cursor-not-allowed" disabled={item.quantity === 1} onClick={() => update(item.id, Math.max(1, item.quantity - 1))}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 cursor-pointer bg-white min-w-8" onClick={() => update(item.id, item.quantity + 1)}>+</button>
                </div>
                <div>
                  <strong>${(item.foodItem.price * item.quantity).toFixed(2)}</strong>
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 cursor-pointer text-red-700 bg-red-50 block mt-1" onClick={() => remove(item.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="border border-gray-200 rounded-2xl bg-white p-4 flex justify-between items-center gap-4 md:flex-col md:items-start">
            <strong>Total: ${basketTotal(basket).toFixed(2)}</strong>
            <div className="flex gap-2.5 items-center">
              <button className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={clear}>
                Clear basket
              </button>
              <Link className="rounded-lg border border-indigo-500 px-3 py-1.5 cursor-pointer bg-indigo-500 text-white no-underline transition-colors" to="/orders">
                Continue to checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
