import { client } from '../api/client';
import type { Category, Food } from '../../type/types';

export const menuGateway = {
  async fetchCategories(): Promise<Category[]> {
    const response = await client.get<Category[]>('/categories');
    return response.data;
  },
  async createCategory(payload: { name: string }): Promise<Category> {
    const response = await client.post<Category>('/categories', payload);
    return response.data;
  },
  async updateCategory(categoryId: number, payload: { name: string }): Promise<Category> {
    const response = await client.put<Category>(`/categories/${categoryId}`, payload);
    return response.data;
  },
  async removeCategory(categoryId: number): Promise<void> {
    await client.delete(`/categories/${categoryId}`);
  },
  async fetchFoods(categoryId?: number): Promise<Food[]> {
    const response = await client.get<Food[]>('/foods', {
      params: categoryId ? { categoryId } : undefined,
    });
    return response.data;
  },
  async createFood(payload: {
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    category: { id: number };
  }): Promise<Food> {
    const response = await client.post<Food>('/foods', payload);
    return response.data;
  },
};
