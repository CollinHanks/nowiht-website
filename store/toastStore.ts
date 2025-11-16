import { create } from 'zustand';

/**
 * NOWIHT Toast System
 * Luxury minimal design - Louis Vuitton aesthetic
 * No emojis, professional only
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // milliseconds (default: 4000)
  persistent?: boolean; // if true, won't auto-dismiss
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

/**
 * Toast Store
 * Global state management for toasts
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 4000, // 4 seconds - elegant timing
      persistent: false,
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss if not persistent
    if (!newToast.persistent) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

/**
 * useToast Hook
 * Easy-to-use toast notifications
 * 
 * @example
 * const toast = useToast();
 * toast.success('Item added to cart');
 * toast.error('Payment failed', 'Please check your card details');
 * toast.warning('Stock running low');
 * toast.info('Promo code applied');
 */
export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (title: string, message?: string, duration?: number) => {
      addToast({ type: 'success', title, message, duration });
    },
    error: (title: string, message?: string, duration?: number) => {
      addToast({ type: 'error', title, message, duration });
    },
    warning: (title: string, message?: string, duration?: number) => {
      addToast({ type: 'warning', title, message, duration });
    },
    info: (title: string, message?: string, duration?: number) => {
      addToast({ type: 'info', title, message, duration });
    },
    custom: (toast: Omit<Toast, 'id'>) => {
      addToast(toast);
    },
  };
};