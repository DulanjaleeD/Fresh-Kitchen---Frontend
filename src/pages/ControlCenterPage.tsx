import { useEffect, useState, type FormEvent } from 'react';
import type { Category, Food } from '../type/types';
import { menuGateway } from '../infra/services/menuGateway';

export function ControlCenterPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  const [foodName, setFoodName] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodStock, setFoodStock] = useState('');
  const [foodCategoryId, setFoodCategoryId] = useState('');

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [busyCategory, setBusyCategory] = useState(false);
  const [busyFood, setBusyFood] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = async () => {
    setLoadingCategories(true);
    setError('');
    try {
      setCategories(await menuGateway.fetchCategories());
    } catch {
      setError('Unable to load categories.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadFoods = async () => {
    setLoadingFoods(true);
    setError('');
    try {
      setFoods(await menuGateway.fetchFoods());
    } catch {
      setError('Unable to load foods.');
    } finally {
      setLoadingFoods(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void Promise.all([loadCategories(), loadFoods()]);
    });
  }, []);

  const saveCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) {
      setError('Category name is required.');
      return;
    }

    setBusyCategory(true);
    setError('');
    try {
      if (editingCategoryId) {
        await menuGateway.updateCategory(editingCategoryId, { name });
      } else {
        await menuGateway.createCategory({ name });
      }
      setCategoryName('');
      setEditingCategoryId(null);
      await loadCategories();
    } catch {
      setError('Unable to save category.');
    } finally {
      setBusyCategory(false);
    }
  };

  const saveFood = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(foodPrice);
    const stockQuantity = Number(foodStock);
    const categoryId = Number(foodCategoryId);

    if (!foodName.trim()) {
      setError('Food name is required.');
      return;
    }

    if (Number.isNaN(price) || price < 0) {
      setError('Price must be 0 or greater.');
      return;
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setError('Stock quantity must be a whole number >= 0.');
      return;
    }

    if (!foodCategoryId || Number.isNaN(categoryId)) {
      setError('Category is required.');
      return;
    }

    setBusyFood(true);
    setError('');
    try {
      await menuGateway.createFood({
        name: foodName.trim(),
        description: foodDescription.trim() || undefined,
        price,
        stockQuantity,
        category: { id: categoryId },
      });
      setFoodName('');
      setFoodDescription('');
      setFoodPrice('');
      setFoodStock('');
      setFoodCategoryId('');
      await loadFoods();
    } catch {
      setError('Unable to save food item.');
    } finally {
      setBusyFood(false);
    }
  };

  const removeCategory = async (id: number) => {
    const confirmed = window.confirm('Delete this category?');
    if (!confirmed) return;

    try {
      await menuGateway.removeCategory(id);
      await loadCategories();
    } catch {
      setError('Unable to delete category.');
    }
  };

  return (
    <section className="grid gap-4.5">
      <h1>Admin Control Center</h1>
      {error && <div className="border border-red-200 bg-red-50 text-red-900 rounded-2xl p-3">{error}</div>}

      <form className="border border-gray-200 rounded-2xl bg-white p-4 grid gap-3.5" onSubmit={saveCategory}>
        <h2>{editingCategoryId ? 'Edit category' : 'Create category'}</h2>
        <label className="grid gap-1.5 text-sm">
          Category name
          <input className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} />
        </label>
        <div className="flex gap-2.5 items-center">
          <button className="rounded-lg border border-indigo-500 px-3 py-1.5 cursor-pointer bg-indigo-500 text-white no-underline transition-colors disabled:opacity-60 disabled:cursor-not-allowed" disabled={busyCategory} type="submit">
            {busyCategory ? 'Saving…' : editingCategoryId ? 'Update' : 'Create'}
          </button>
          {editingCategoryId && (
            <button className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors" type="button" onClick={() => {
              setEditingCategoryId(null);
              setCategoryName('');
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <section className="border border-gray-200 rounded-2xl bg-white p-4 grid gap-3.5">
        <h2>Categories</h2>
        {loadingCategories ? (
          <p>Loading categories…</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((category) => (
            <div className="border border-gray-200 rounded-2xl bg-white p-4 flex justify-between items-center gap-4 md:flex-col md:items-start" key={category.id}>
              <strong>{category.name}</strong>
              <div className="flex gap-2.5 items-center">
                <button className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => {
                  setEditingCategoryId(category.id);
                  setCategoryName(category.name);
                }}>
                  Edit
                </button>
                <button className="rounded-lg border border-red-200 px-3 py-1.5 cursor-pointer text-red-700 bg-red-50" onClick={() => removeCategory(category.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <form className="border border-gray-200 rounded-2xl bg-white p-4 grid gap-3.5" onSubmit={saveFood}>
        <h2>Create food item</h2>
        <label className="grid gap-1.5 text-sm">
          Name
          <input className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" value={foodName} onChange={(event) => setFoodName(event.target.value)} />
        </label>
        <label className="grid gap-1.5 text-sm">
          Category
          <select className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" value={foodCategoryId} onChange={(event) => setFoodCategoryId(event.target.value)}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          Price
          <input className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" type="number" min="0" step="0.01" value={foodPrice} onChange={(event) => setFoodPrice(event.target.value)} />
        </label>
        <label className="grid gap-1.5 text-sm">
          Stock
          <input className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" type="number" min="0" step="1" value={foodStock} onChange={(event) => setFoodStock(event.target.value)} />
        </label>
        <label className="grid gap-1.5 text-sm">
          Description
          <textarea className="border border-gray-200 rounded-lg px-2.5 py-2.5 font-inherit w-full" rows={3} value={foodDescription} onChange={(event) => setFoodDescription(event.target.value)} />
        </label>
        <button className="rounded-lg border border-indigo-500 px-3 py-1.5 cursor-pointer bg-indigo-500 text-white no-underline transition-colors disabled:opacity-60 disabled:cursor-not-allowed" disabled={busyFood} type="submit">
          {busyFood ? 'Saving…' : 'Create food'}
        </button>
      </form>

      <section className="border border-gray-200 rounded-2xl bg-white p-4 grid gap-3.5">
        <h2>Food catalog</h2>
        {loadingFoods ? (
          <p>Loading foods…</p>
        ) : foods.length === 0 ? (
          <p>No food items found.</p>
        ) : (
          foods.map((food) => (
            <article className="border border-gray-200 rounded-2xl bg-white p-4" key={food.id}>
              <header className="flex justify-between gap-2">
                <h3 className="m-0">{food.name}</h3>
                <strong>${food.price.toFixed(2)}</strong>
              </header>
              <p>{food.description || 'No description provided.'}</p>
              <small>
                {food.category?.name || 'Uncategorized'} · Stock {food.stockQuantity}
              </small>
            </article>
          ))
        )}
      </section>
    </section>
  );
}
