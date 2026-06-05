import React from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/components/ui/Toast';
import { usePage } from '@inertiajs/react';
import { Tag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    variant?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
    const { props } = usePage();
    const appColors = (props as any).appColors as Record<string, string> | undefined;
    const menuOnly = appColors?.menu_only === 'true';
    const { addItem } = useCartStore();
    const { addToast } = useToast();

    const handleAddToCart = () => {
        addItem(product);
        addToast(`${product.name} adicionado ao carrinho!`, 'success');
    };

    if (variant === 'list') {
        return (
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex gap-4 p-0">
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
                                <Button onClick={handleAddToCart} size="sm" className="h-7 text-xs px-3">
                                    Adicionar
                                </Button>
                            )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
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
                <h3 className="font-semibold text-lg leading-tight mb-1">{product.name}</h3>
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
                        <Button onClick={handleAddToCart} size="sm">
                            Adicionar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

