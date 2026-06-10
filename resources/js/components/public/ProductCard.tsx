import { useState, useCallback } from 'react';
import { Link, router } from '@inertiajs/react';
import { Product, Addon } from '@/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/components/ui/Toast';
import { usePage } from '@inertiajs/react';
import { Tag, Plus, Check, ChevronRight } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ProductCardProps {
    product: Product;
    variant?: 'grid' | 'list';
}

interface SelectedAddons {
    [categoryId: number]: Addon[];
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
    const { props } = usePage();
    const appColors = (props as any).appColors as Record<string, string> | undefined;
    const menuOnly = appColors?.menu_only === 'true';
    const { addItem } = useCartStore();
    const { addToast } = useToast();

    const [addonDialogOpen, setAddonDialogOpen] = useState(false);
    const [selectedAddons, setSelectedAddons] = useState<SelectedAddons>({});

    const hasAddons = product.addon_categories && product.addon_categories.length > 0;
    const productUrl = `/produto/${product.id}`;

    const resetSelection = useCallback(() => {
        setSelectedAddons({});
    }, []);

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        addItem(product);
        addToast(`${product.name} adicionado ao carrinho!`, 'success');
    };

    const handleOpenAddonModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        resetSelection();
        setAddonDialogOpen(true);
    };

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

    const handleConfirmAddons = () => {
        if (!canConfirm()) return;

        const allAddons: Addon[] = [];
        Object.values(selectedAddons).forEach((addons) => {
            allAddons.push(...addons);
        });

        addItem(product, 1, allAddons);
        setAddonDialogOpen(false);
        const addonText = allAddons.length > 0 ? ` com ${allAddons.length} adicional(is)` : '';
        addToast(`${product.name}${addonText} adicionado ao carrinho!`, 'success');
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

    const productPrice = product.promotional_price ?? product.price;
    const totalPrice = productPrice + getAddonPriceTotal();

    const renderAddonDialog = () => (
        <Dialog open={addonDialogOpen} onOpenChange={setAddonDialogOpen}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                    {product.description && (
                        <DialogDescription>{product.description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-4">
                    {product.addon_categories?.map((category) => (
                        <div key={category.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{category.name}</h4>
                                <div className="text-xs text-muted-foreground">
                                    {category.min_select > 0 && <span>Mín: {category.min_select}</span>}
                                    {category.max_select > 0 && (
                                        <span className="ml-2">Máx: {category.max_select}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                {category.addons
                                    ?.filter((a) => a.is_active)
                                    .map((addon) => {
                                        const isSelected = (selectedAddons[category.id] || []).some(
                                            (a) => a.id === addon.id
                                        );
                                        return (
                                            <label
                                                key={addon.id}
                                                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'hover:bg-muted/50'
                                                }`}
                                            >
                                                {category.max_select === 1 ? (
                                                    <div
                                                        className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                                                            isSelected
                                                                ? 'border-primary bg-primary'
                                                                : 'border-input'
                                                        }`}
                                                    >
                                                        {isSelected && <Check className="size-3 text-primary-foreground" />}
                                                    </div>
                                                ) : (
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={(checked) =>
                                                            handleToggleAddon(category.id, addon, !!checked)
                                                        }
                                                    />
                                                )}
                                                <span className="flex-1 text-sm">{addon.name}</span>
                                                <span className="text-sm font-medium">
                                                    {addon.price > 0 ? formatPrice(addon.price) : 'Grátis'}
                                                </span>
                                            </label>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Produto</span>
                        <span>{formatPrice(productPrice)}</span>
                    </div>
                    {getAddonPriceTotal() > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Adicionais</span>
                            <span>{formatPrice(getAddonPriceTotal())}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between font-bold text-base border-t pt-2">
                        <span>Total</span>
                        <span>{formatPrice(totalPrice)}</span>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between gap-2">
                    <Button variant="outline" onClick={() => setAddonDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAddons} disabled={!canConfirm()}>
                        <Plus className="size-4 mr-1" />
                        Adicionar ao carrinho
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    if (variant === 'list') {
        return (
            <>
                <Link
                    href={productUrl}
                    className="block bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex gap-4 p-0">
                        <div className="w-28 h-28 shrink-0 bg-muted relative">
                            {product.image ? (
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                    Sem imagem
                                </div>
                            )}
                            {product.has_promotion && (
                                <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                    <Tag className="size-2.5" /> PROMO
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col justify-between py-3 pr-3 min-w-0 flex-1">
                            <div className="min-w-0">
                                <h3 className="font-semibold text-sm leading-tight mb-0.5 truncate">{product.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-1">
                                <div className="flex flex-col">
                                    {product.has_promotion ? (
                                        <>
                                            <span className="text-xs text-muted-foreground line-through">
                                                {product.formatted_price}
                                            </span>
                                            <span className="font-bold text-sm text-red-500">
                                                {product.formatted_promotional_price}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="font-bold text-sm">{product.formatted_price}</span>
                                    )}
                                </div>
                                {!menuOnly && (
                                    hasAddons ? (
                                        <Button onClick={handleOpenAddonModal} size="sm" className="h-7 text-xs px-3">
                                            Adicionar
                                        </Button>
                                    ) : (
                                        <Button onClick={handleQuickAdd} size="sm" className="h-7 text-xs px-3">
                                            Adicionar
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
                {renderAddonDialog()}
            </>
        );
    }

    return (
        <>
            <Link
                href={productUrl}
                className="block bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="flex flex-col">
                    <div className="aspect-video bg-muted relative">
                        {product.image ? (
                            <img
                                src={`/storage/${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                Sem imagem
                            </div>
                        )}
                        {product.has_promotion && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <Tag className="size-3" /> PROMOÇÃO
                            </div>
                        )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                            {hasAddons && (
                                <ChevronRight className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
                            {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                {product.has_promotion ? (
                                    <>
                                        <span className="text-sm text-muted-foreground line-through">
                                            {product.formatted_price}
                                        </span>
                                        <span className="font-bold text-lg text-red-500">
                                            {product.formatted_promotional_price}
                                        </span>
                                    </>
                                ) : (
                                    <span className="font-bold text-lg">{product.formatted_price}</span>
                                )}
                            </div>
                            {!menuOnly && (
                                hasAddons ? (
                                    <Button size="sm" onClick={handleOpenAddonModal}>
                                        Adicionar
                                    </Button>
                                ) : (
                                    <Button onClick={handleQuickAdd} size="sm">
                                        Adicionar
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </Link>
            {renderAddonDialog()}
        </>
    );
};
