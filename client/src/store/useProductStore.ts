import { create } from 'zustand';
import api from '../services/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  badge: string | null;
  image: string;
  category: string;
  ingredients: string[];
  prepSteps: string[];
  active?: boolean;
  discount?: {
    type: 'percent' | 'fixed';
    value: number;
    expiryDate?: string;
  } | null;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Product[]>('/products');
      set({ products: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch products', isLoading: false });
    }
  },
  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Product>('/products', product);
      set({ products: [...get().products, response.data], isLoading: false });
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to add product';
      set({ error: errMsg, isLoading: false });
      throw new Error(errMsg);
    }
  },
  updateProduct: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put<Product>(`/products/${id}`, updatedFields);
      set({
        products: get().products.map((p) => (p.id === id ? response.data : p)),
        isLoading: false,
      });
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to update product';
      set({ error: errMsg, isLoading: false });
      throw new Error(errMsg);
    }
  },
  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      set({
        products: get().products.filter((p) => p.id !== id),
        isLoading: false,
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to delete product';
      set({ error: errMsg, isLoading: false });
      throw new Error(errMsg);
    }
  },
}));
