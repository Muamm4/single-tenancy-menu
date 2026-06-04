import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, quantity = 1) => {
                const price = product.promotional_price ?? product.price;
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                        };
                    }
                    return {
                        items: [
                            ...state.items,
                            {
                                id: product.id,
                                name: product.name,
                                price,
                                quantity,
                                image: product.image,
                                category_name: product.category?.name,
                            },
                        ],
                    };
                });
            },
            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },
            updateQuantity: (productId, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: () =>
                get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    const items = persistedState?.state?.items ?? [];
                    return {
                        ...persistedState,
                        state: {
                            ...persistedState.state,
                            items: items.map((item: any) => ({
                                ...item,
                                price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
                            })),
                        },
                    };
                }
                return persistedState;
            },
        }
    )
);
