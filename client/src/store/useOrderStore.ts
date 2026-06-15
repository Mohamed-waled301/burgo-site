import { create } from 'zustand';
import api from '../services/api';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  governorate: string;
  notes: string;
  items: OrderItem[];
  total: number;
  paymentMethod: 'card' | 'wallet' | 'cod';
  status: 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'total' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<Order>;
  checkNewOrderFlag: () => Promise<{ hasNew: boolean; orderId?: string }>;
  clearNewOrderFlag: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Order[]>('/orders');
      set({ orders: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.error || 'Failed to fetch orders', isLoading: false });
    }
  },
  placeOrder: async (order) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<Order>('/orders', order);
      set({ orders: [response.data, ...get().orders], isLoading: false });
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to place order';
      set({ error: errMsg, isLoading: false });
      throw new Error(errMsg);
    }
  },
  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<Order>(`/orders/${id}/status`, { status });
      set({
        orders: get().orders.map((o) => (o.id === id ? response.data : o)),
        isLoading: false,
      });
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to update order status';
      set({ error: errMsg, isLoading: false });
      throw new Error(errMsg);
    }
  },
  checkNewOrderFlag: async () => {
    try {
      const response = await api.get<{ hasNew: boolean; orderId?: string }>('/orders/new-flag');
      return response.data;
    } catch (err) {
      return { hasNew: false };
    }
  },
  clearNewOrderFlag: async () => {
    try {
      await api.post('/orders/clear-flag');
    } catch (err) {
      console.error('Failed to clear new order flag on server:', err);
    }
  },
}));
