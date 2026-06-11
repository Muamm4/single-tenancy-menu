import React, { useState, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import { Product, Addon } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/stores/cartStore';
import { useToast, ToastProvider } from '@/components/ui/Toast';
import { ArrowLeft, Check, Tag, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductDetailProps {
    product: Product;
}

interface SelectedAddons {
    [categoryId: number]: Addon[];
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const { addItem } = useCartStore();
    const { addToast } = useToast();
    const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});
    const [loading, setLoading] = useState(false);

    const hasAddons = product.addon_categories && product.addon_categories.length > 0;

    const handleToggleAddon = useCallback((categoryId: number, addon: Addon, isSelected: boolean) => {
        setSelectedAddons((prev) => {
            const category = product.addon_categories?.find((c) => c.id === categoryId);
            const current = prev[categoryId] || [];

            if (isSelected) {
                if (category && category.max_select === 1) {
                    return { ...prev, [categoryId]: [addon] };
                }
                return { ...prev, [categoryId]: [...current, addon] };
            } else {
                return {
                    ...prev,
                    [categoryId]: current.filter((a) => a.id !== addon.id),
                };
            }
        });
    }, [product.addon_categories]);

    const isCategoryValid = (categoryId: number) => {
        const category = product.addon_categories?.find((c) => c.id === categoryId);
        if (!category) return true;
        const selected = selectedAddons[categoryId] || [];
        return selected.length >= category.min_select;
    };

    const canConfirm = () => {
        if (!product.addon_categories) return true;
        return product.addon_categories.every((cat) => isCategoryValid(cat.id));
    };

    const getAddonPriceTotal = (): number => {
        let total = 0;
        for (const cat of product.addon_categories || []) {
            const selected = selectedAddons[cat.id] || [];
            for (const a of selected) {
                total += a.price;
            }
        }
        return total;
    };

    const handleAddToCart = () => {
        if (!canConfirm()) return;
        setLoading(true);

        const allAddons: Addon[] = [];
        Object.values(selectedAddons).forEach((addons) => {
            allAddons.push(...addons);
        });

        addItem(product, 1, allAddons);
        const addonText = allAddons.length > 0 ? ` com ${allAddons.length} adicional(is)` : '';
        addToast(`${product.name}${addonText} adicionado ao carrinho!`, 'success');

        setTimeout(() => {
            router.visit(route('menu'));
        }, 800);
    };

    const productPrice = product.promotional_price ?? product.price;
    const addonTotal = getAddonPriceTotal();
    const total = productPrice + addonTotal;

    return (
        <ToastProvider>
            <Head title={product.name} />

            <div className="min-h-dvh bg-background flex flex-col">
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
                    <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit(route('menu'))}
                            className="shrink-0"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <h1 className="font-semibold text-lg truncate">{product.name}</h1>
                    </div>
                </header>

                <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-32 mb-16">
                    {product.image && (
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden mt-4 mb-6">
                            <img
                                src={`/storage/${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="mb-6 mt-4">
                        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                        {product.description && (
                            <p className="text-muted-foreground">{product.description}</p>
                        )}
                        <div className="mt-3">
                            {product.has_promotion ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-muted-foreground line-through">
                                        {product.formatted_price}
                                    </span>
                                    <span className="text-2xl font-bold text-red-500">
                                        {product.formatted_promotional_price}
                                    </span>
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Tag className="size-3" /> PROMO
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl font-bold">{product.formatted_price}</span>
                            )}
                        </div>
                    </div>

                    {hasAddons && (
                        <div className="space-y-6 mb-8">
                            <h3 className="font-semibold text-lg border-b pb-2">Adicionais</h3>

                            {product.addon_categories?.map((category) => (
                                <div key={category.id} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{category.name}</h4>
                                        <div className="text-xs text-muted-foreground">
                                            {category.min_select > 0 && (
                                                <span>Mín: {category.min_select}</span>
                                            )}
                                            {category.max_select > 0 && (
                                                <span className="ml-2">Máx: {category.max_select}</span>
                                            )}
                                            {!isCategoryValid(category.id) && (
                                                <span className="ml-2 text-destructive font-medium">
                                                    Selecione mais {category.min_select - (selectedAddons[category.id]?.length || 0)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {category.addons
                                            ?.filter((a) => a.is_active)
                                            .map((addon) => {
                                                const isSelected = (selectedAddons[category.id] || []).some(
                                                    (a) => a.id === addon.id
                                                );
                                                const isMaxed =
                                                    category.max_select > 0 &&
                                                    !isSelected &&
                                                    (selectedAddons[category.id]?.length || 0) >= category.max_select;

                                                return (
                                                    <div
                                                        key={addon.id}
                                                        className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${isSelected
                                                            ? 'border-primary bg-primary/5'
                                                            : isMaxed
                                                                ? 'opacity-50 cursor-not-allowed'
                                                                : 'hover:bg-muted/50'
                                                            }`}
                                                        onClick={() => {
                                                            if (isMaxed) return;
                                                            handleToggleAddon(category.id, addon, !isSelected);
                                                        }}
                                                    >
                                                        {category.max_select === 1 ? (
                                                            <div
                                                                className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${isSelected
                                                                    ? 'border-primary bg-primary'
                                                                    : 'border-input'
                                                                    }`}
                                                            >
                                                                {isSelected && (
                                                                    <Check className="size-3 text-primary-foreground" />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <Checkbox
                                                                checked={isSelected}
                                                                disabled={isMaxed}
                                                            />
                                                        )}
                                                        <span className="flex-1 text-sm">{addon.name}</span>
                                                        <span className="text-sm font-medium">
                                                            {addon.price > 0 ? formatPrice(addon.price) : 'Grátis'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 pb-[calc(0.75rem+var(--safe-bottom,0px))]">
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-1 mb-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Produto</span>
                                <span>{formatPrice(productPrice)}</span>
                            </div>
                            {addonTotal > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Adicionais</span>
                                    <span>{formatPrice(addonTotal)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-base">Total</span>
                            <span className="font-bold text-lg">{formatPrice(total)}</span>
                        </div>

                        <Button
                            className="w-full h-12 text-base font-semibold"
                            onClick={handleAddToCart}
                            disabled={!canConfirm() || loading}
                        >
                            {loading ? (
                                'Adicionando...'
                            ) : (
                                <>
                                    <ShoppingCart className="size-5 mr-2" />
                                    Adicionar ao carrinho
                                </>
                            )}
                        </Button>
                    </div>
                </footer>
            </div>
        </ToastProvider>
    );
}
