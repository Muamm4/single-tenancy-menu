import { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCartStore } from '@/stores/cartStore';
import { PublicLayout } from '@/layouts/public-layout';
import { useToast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/utils';

interface Address {
    id: number;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zip_code: string;
    is_default: boolean;
}

export default function Cart() {
    const { props } = usePage<{
        auth?: { user?: { name?: string; email?: string; phone?: string } };
        addresses?: Address[];
        defaultAddress?: Address | null;
        isOpen?: boolean;
    }>();

    const appColors = (props as any).appColors as Record<string, string> | undefined;
    const menuOnly = appColors?.menu_only === 'true';
    const isOpen = props.isOpen !== false; // defaults to true if not set

    const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();
    const { addToast } = useToast();

    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState('');

    useEffect(() => {
        if (menuOnly) {
            router.visit(route('menu'));
        }
    }, [menuOnly]);

    const user = props.auth?.user;
    const addresses = props.addresses || [];
    const defaultAddr = props.defaultAddress;

    useEffect(() => {
        if (user?.name) setCustomerName(user.name);
        if (user?.phone) setCustomerPhone(user.phone);
        if (defaultAddr?.id) setSelectedAddressId(defaultAddr.id);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setIsSubmitting(true);
        try {
            const payload: Record<string, unknown> = {
                customer_name: customerName,
                customer_phone: customerPhone,
                notes,
                items: items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    addons: item.addons || [],
                })),
                total: totalPrice(),
            };

            if (selectedAddressId) {
                payload.address_id = selectedAddressId;
            }

            const response = await fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Erro ao enviar pedido');

            const data = await response.json();
            setWhatsappLink(data.whatsapp_link);
            setSubmitted(true);
            clearCart();
        } catch (error) {
            console.error('Erro ao enviar pedido:', error);
            alert('Ocorreu um erro ao enviar seu pedido. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0 && !submitted) {
        return (
            <PublicLayout title="Carrinho">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <ShoppingCart className="size-16 text-muted-foreground/40 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
                    <p className="text-muted-foreground mb-6">Adicione produtos do cardápio</p>
                    <Button asChild>
                        <Link href={route('menu')}>Ver Cardápio</Link>
                    </Button>
                </div>
            </PublicLayout>
        );
    }

    if (submitted) {
        return (
            <PublicLayout title="Pedido enviado!">
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="size-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Pedido enviado com sucesso!</h2>
                    <p className="text-muted-foreground mb-8">
                        Clique no botão abaixo para finalizar pelo WhatsApp.
                    </p>
                    {whatsappLink && (
                        <Button
                            className="w-full mb-4 gap-2"
                            size="lg"
                            onClick={() => window.open(whatsappLink, '_blank')}
                        >
                            Falar no WhatsApp
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => window.location.href = route('menu')}
                    >
                        <ArrowLeft className="size-4" />
                        Voltar ao Cardápio
                    </Button>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout title="Seu Carrinho" description={`${items.length} item(ns) adicionados`}>
            <div className="max-w-lg mx-auto space-y-6">
                <div className="space-y-3">
                    {items.map((item) => {
                        const itemKey = item._key || `${item.id}_`;
                        return (
                            <div key={itemKey} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                                {item.image ? (
                                    <img
                                        src={`/storage/${item.image}`}
                                        alt={item.name}
                                        className="size-16 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="size-16 rounded-lg bg-muted flex items-center justify-center">
                                        <ShoppingCart className="size-6 text-muted-foreground/40" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm leading-tight">{item.name}</p>
                                    {item.category_name && (
                                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                                            {item.category_name}
                                        </p>
                                    )}
                                    {item.addons && item.addons.length > 0 && (
                                        <div className="mt-1 space-y-0.5">
                                            {item.addons.map((addon) => (
                                                <span
                                                    key={addon.id}
                                                    className="text-xs text-muted-foreground block ml-2"
                                                >
                                                    + {addon.name}{' '}
                                                    {addon.price > 0
                                                        ? `(+${formatPrice(addon.price)})`
                                                        : '(Grátis)'}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-sm text-primary font-semibold mt-1">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => updateQuantity(itemKey, Math.max(1, item.quantity - 1))}
                                    >
                                        <Minus className="size-4" />
                                    </Button>
                                    <span className="w-8 text-center font-medium text-sm">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                    >
                                        <Plus className="size-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive"
                                        onClick={() => {
                                            removeItem(itemKey);
                                            addToast(`${item.name} removido do carrinho`, 'error');
                                        }}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-between items-center p-4 rounded-xl bg-muted/50">
                    <span className="text-base">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(totalPrice())}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-6 bg-card">
                    <h3 className="font-semibold text-lg tracking-tight">Finalizar Pedido</h3>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            placeholder="Seu nome"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                        <Input
                            id="phone"
                            placeholder="(11) 99999-9999"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            required
                        />
                    </div>

                    {addresses.length > 0 && (
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                Endereço de entrega
                            </Label>
                            <div className="space-y-2">
                                {addresses.map((address) => (
                                    <label
                                        key={address.id}
                                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                            selectedAddressId === address.id
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:bg-muted/50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="address"
                                            className="mt-1"
                                            checked={selectedAddressId === address.id}
                                            onChange={() => setSelectedAddressId(address.id)}
                                        />
                                        <div className="text-sm">
                                            <p className="font-medium">
                                                {address.street}, {address.number}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {address.neighborhood}, {address.city} - {address.zip_code}
                                            </p>
                                            {address.is_default && (
                                                <span className="text-[10px] text-primary font-medium">Padrão</span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                            id="notes"
                            placeholder="Alguma observação sobre o pedido?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {!isOpen && (
                        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            <Clock className="size-4 shrink-0" />
                            <span>Restaurante fechado no momento. O pedido não pode ser enviado.</span>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting || items.length === 0 || !isOpen}
                        className="w-full gap-2"
                        size="lg"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar Pedido'}
                    </Button>
                </form>
            </div>
        </PublicLayout>
    );
}
