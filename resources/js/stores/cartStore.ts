import { create } from 'zustand';
import { CartItem, Product } from '@/types';

interface AddonInput {
    id: number;
    name: string;
    price: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, addons?: AddonInput[]) => void;
    removeItem: (key: string) => void;
    updateQuantity: (key: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

function generateItemKey(productId: number, addons: AddonInput[] = []): string {
    const addonIds = addons
        .map((a) => a.id)
        .sort((a, b) => a - b)
        .join(',');
    return `${productId}_${addonIds}`;
}

function getItemKey(item: CartItem): string {
    if (item._key) return item._key;
    const addonIds = (item.addons || [])
        .map((a) => a.id)
        .sort((a, b) => a - b)
        .join(',');
    return `${item.id}_${addonIds}`;
}

export const useCartStore = create<CartState>()((set, get) => ({
    items: [],
    addItem: (product, quantity = 1, addons = []) => {
        const price = product.promotional_price ?? product.price;
        const key = generateItemKey(product.id, addons);

        set((state) => {
            const existingItem = state.items.find((item) => getItemKey(item) === key);

            if (existingItem) {
                return {
                    items: state.items.map((item) =>
                        getItemKey(item) === key
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
                        _key: key,
                        name: product.name,
                        price,
                        quantity,
                        image: product.image,
                        category_name: product.category?.name,
                        addons: addons.map((a) => ({
                            id: a.id,
                            name: a.name,
                            price: a.price,
                        })),
                    },
                ],
            };
        });
    },
    removeItem: (key) => {
        set((state) => ({
            items: state.items.filter((item) => getItemKey(item) !== key),
        }));
    },
    updateQuantity: (key, quantity) => {
        set((state) => ({
            items: state.items.map((item) =>
                getItemKey(item) === key ? { ...item, quantity } : item
            ),
        }));
    },
    clearCart: () => set({ items: [] }),
    totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: () =>
        get().items.reduce((sum, item) => {
            const addonTotal = (item.addons || []).reduce((s, a) => s + a.price, 0);
            return sum + (item.price + addonTotal) * item.quantity;
        }, 0),
}));
