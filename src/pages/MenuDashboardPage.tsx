import { useEffect, useMemo, useState } from 'react';
import { menuGateway } from '../infra/services/menuGateway';
import type { Category, Food } from '../type/types';
import { useBasket } from '../state/basket/useBasket';

export function MenuDashboardPage() {
  const { add, loading: basketLoading } = useBasket();
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [foodRows, categoryRows] = await Promise.all([menuGateway.fetchFoods(), menuGateway.fetchCategories()]);
        setFoods(foodRows);
        setCategories(categoryRows);
      } catch {
        setError('Unable to load menu data.');
      } finally {
        setLoading(false);
      }
    };

    queueMicrotask(() => {
      void load();
    });
  }, []);

  const visibleFoods = useMemo(() => {
    if (selectedCategory === 'all') return foods;
    return foods.filter((food) => food.category?.id === selectedCategory);
  }, [foods, selectedCategory]);

  if (loading) return <div className="border border-gray-200 rounded-2xl bg-white p-4">Loading menu…</div>;
  if (error) return <div className="border border-gray-200 rounded-2xl bg-white p-4 border-red-200 bg-red-50 text-red-900 rounded-2xl p-3">{error}</div>;

  return (
    <section className="grid gap-4.5">
      <div className="border border-gray-200 rounded-2xl bg-white p-4">
        <h1 className="m-0">Flavor Control Room</h1>
        <p className="m-0 mt-1.5">Choose a category, inspect dishes, and push items directly into your basket.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? 'border border-gray-900 rounded-full bg-gray-900 px-3 py-1.5 text-white transition-all' : 'border border-gray-200 rounded-full bg-white px-3 py-1.5 transition-all'}>
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id ? 'border border-gray-900 rounded-full bg-gray-900 px-3 py-1.5 text-white transition-all' : 'border border-gray-200 rounded-full bg-white px-3 py-1.5 transition-all'}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
        {visibleFoods.map((food) => (
          <article className="flex flex-col justify-end h-100 border  border-gray-200 rounded-2xl bg-white p-4" key={food.id}>
            <header className="flex justify-between gap-2">
              <h3 className="m-0">{food.name}   <strong>${food.price.toFixed(2)}</strong></h3>
              
            </header>
            <p className='my-3'>{food.description || 'No description provided.'}</p>
            <small className='mb-5'>
              {food.category?.name || 'Uncategorized'} · Stock: {food.stockQuantity}
            </small>
            <button
              className="rounded-lg border border-indigo-500 px-3 py-1.5 cursor-pointer bg-indigo-500 text-white no-underline transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={food.stockQuantity === 0 || basketLoading}
              onClick={() => add(food.id)}
            >
              {food.stockQuantity === 0 ? 'Out of stock' : 'Add to basket'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
