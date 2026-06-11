import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Minus, Plus, Trash2, ShoppingCart, Clock } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
    const { props } = usePage();
    const isOpen = (props as any).isOpen !== false;
    const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{ whatsapp_link: string } | null>(null);

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = async () => {
        if (!isOpen) {
            addToast('Restaurante fechado no momento.', 'error');
            return;
        }

        if (!customerName.trim() || !customerPhone.trim()) {
            addToast('Por favor, preencha seu nome e telefone.', 'error');
            return;
        }

        if (items.length === 0) {
            addToast('Seu carrinho está vazio.', 'error');
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            customer_name: customerName,
            customer_phone: customerPhone,
            notes: notes || null,
            items: items.map((item) => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                addons: item.addons || [],
            })),
            total: totalPrice(),
        };

        try {
            const csrfToken =
                document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

            const response = await fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (data.whatsapp_link) {
                setSuccessData({ whatsapp_link: data.whatsapp_link });
                addToast('Pedido enviado com sucesso!', 'success');
            } else {
                addToast('Erro ao enviar pedido. Tente novamente.', 'error');
                setIsSubmitting(false);
            }
        } catch {
            addToast('Erro ao enviar pedido. Tente novamente.', 'error');
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppClick = () => {
        if (successData?.whatsapp_link) {
            window.open(successData.whatsapp_link, '_blank');
            clearCart();
            setSuccessData(null);
            setCustomerName('');
            setCustomerPhone('');
            setNotes('');
            onOpenChange(false);
        }
    };

    const handleClose = () => {
        if (!successData) {
            onOpenChange(false);
        } else {
            clearCart();
            setSuccessData(null);
            setCustomerName('');
            setCustomerPhone('');
            setNotes('');
            onOpenChange(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent 
                side="right" 
                className="flex flex-col w-full sm:max-w-md p-0 overflow-hidden"
            >
                <div className="flex flex-col h-full">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle className="flex items-center gap-2 text-xl">
                            <ShoppingCart className="size-6" />
                            Carrinho de Compras
                        </SheetTitle>
                    </SheetHeader>

                    {successData ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
                            <div className="size-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <span className="text-4xl">✓</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">
                                    Pedido Enviado!
                                </h3>
                                <p className="text-muted-foreground text-lg">
                                    Seu pedido foi criado com sucesso.
                                </p>
                            </div>
                            <Button
                                onClick={handleWhatsAppClick}
                                className="w-full py-6 text-lg font-semibold bg-green-600 hover:bg-green-700"
                            >
                                Enviar via WhatsApp
                            </Button>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
                            <ShoppingCart className="size-20 text-muted-foreground/20" />
                            <div>
                                <h3 className="text-xl font-medium text-foreground mb-2">
                                    Carrinho vazio
                                </h3>
                                <p className="text-muted-foreground">
                                    Adicione itens do cardápio para fazer seu pedido.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {items.map((item) => {
                                    const itemKey = item._key || `${item.id}_`;
                                    return (
                                    <div
                                        key={itemKey}
                                        className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/50"
                                    >
                                        <div className="size-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={`/storage/${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg">
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-base truncate">
                                                {item.name}
                                            </h4>
                                            {item.addons && item.addons.length > 0 && (
                                                <div className="mt-0.5 space-y-0.5 mb-1">
                                                    {item.addons.map((addon) => (
                                                        <span
                                                            key={addon.id}
                                                            className="text-xs text-muted-foreground block ml-1"
                                                        >
                                                            + {addon.name}{' '}
                                                            {addon.price > 0
                                                                ? `(+${formatPrice(addon.price)})`
                                                                : '(Grátis)'}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-sm font-bold text-primary mb-3">
                                                {formatPrice(item.price)}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 bg-background border rounded-lg p-1">
                                                    <button
                                                        onClick={() => {
                                                            if (item.quantity > 1) {
                                                                updateQuantity(itemKey, item.quantity - 1);
                                                            } else {
                                                                removeItem(itemKey);
                                                                addToast(`${item.name} removido do carrinho`, 'error');
                                                            }
                                                        }}
                                                        className="size-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-sm font-bold min-w-[20px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                                        className="size-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        removeItem(itemKey);
                                                        addToast(`${item.name} removido do carrinho`, 'error');
                                                    }}
                                                    className="ml-auto size-8 rounded-md text-destructive flex items-center justify-center hover:bg-destructive/10 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-foreground">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>

                                <div className="p-6 border-t bg-background space-y-6 pb-10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium">Total do Pedido</span>
                                        <span className="text-2xl font-bold text-primary">
                                            {formatPrice(totalPrice())}
                                        </span>
                                    </div>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="customerName" className="text-sm font-semibold">Nome Completo</Label>
                                            <Input
                                                id="customerName"
                                                placeholder="Digite seu nome"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="h-12 text-base"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="customerPhone" className="text-sm font-semibold">Telefone / WhatsApp</Label>
                                            <Input
                                                id="customerPhone"
                                                placeholder="(00) 00000-0000"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                type="tel"
                                                className="h-12 text-base"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="notes" className="text-sm font-semibold">Observações</Label>
                                            <Textarea
                                                id="notes"
                                                placeholder="Ex: Sem cebola, ponto da massa..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                rows={2}
                                                className="text-base"
                                            />
                                        </div>
                                    </div>
                                    {!isOpen && (
                                        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                            <Clock className="size-4 shrink-0" />
                                            <span>Restaurante fechado no momento.</span>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !isOpen}
                                        className="w-full h-14 text-lg font-bold shadow-lg"
                                        size="lg"
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Finalizar Pedido'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </SheetContent>

        </Sheet>
    );
}
