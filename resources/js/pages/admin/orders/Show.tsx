import { type BreadcrumbItem, type Order, type CartItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Check, X, MessageSquare, Package, User, Phone, Clock, DollarSign, UtensilsCrossed, FileText, MapPin } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderShowProps {
    order: Order;
}

function formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);
}

function getStatusBadgeVariant(status: Order['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'pending':
            return 'secondary';
        case 'accepted':
            return 'default';
        case 'preparing':
            return 'outline';
        case 'ready':
            return 'default';
        case 'rejected':
            return 'destructive';
        default:
            return 'secondary';
    }
}

function getStatusLabel(status: Order['status']): string {
    switch (status) {
        case 'pending':
            return 'Pendente';
        case 'accepted':
            return 'Aceito';
        case 'preparing':
            return 'Preparando';
        case 'ready':
            return 'Pronto';
        case 'rejected':
            return 'Recusado';
        default:
            return status;
    }
}

export default function OrderShow({ order }: OrderShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Pedidos', href: route('admin.orders.index') },
        { title: `Pedido #${order.id}`, href: '#' },
    ];

    const updateStatus = (status: 'accepted' | 'rejected' | 'preparing' | 'ready') => {
        router.patch(route('admin.orders.update-status', order.id), {
            status,
        });
    };

    const formatPhoneForWhatsApp = (phone: string) => {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
    };

    const formatItemName = (item: CartItem): string => {
        return item.product_name || item.name;
    };

    const getItemUnitPrice = (item: CartItem): number => {
        return item.unit_price || item.price;
    };

    const getItemSubtotal = (item: CartItem): number => {
        return item.subtotal || item.price * item.quantity;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pedido #${order.id}`} />
            <div>
                <div className="flex items-center gap-4 mb-6">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('admin.orders.index')}>
                            <ArrowLeft className="size-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Pedido #{order.id}</h1>
                        <p className="text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {new Date(order.created_at).toLocaleString('pt-BR')}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Badge variant={getStatusBadgeVariant(order.status)} className="px-3 py-1 text-sm">
                            {getStatusLabel(order.status)}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <User className="size-5 text-muted-foreground" />
                            <CardTitle className="text-base">Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-medium">{order.customer_name}</p>
                            <a
                                href={`https://wa.me/${formatPhoneForWhatsApp(order.customer_phone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <MessageSquare className="size-3" />
                                {order.customer_phone}
                            </a>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <Package className="size-5 text-muted-foreground" />
                            <CardTitle className="text-base">Itens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{order.items.length}</p>
                            <p className="text-sm text-muted-foreground">produtos no pedido</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <DollarSign className="size-5 text-muted-foreground" />
                            <CardTitle className="text-base">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-primary">{formatPrice(order.total)}</p>
                            <p className="text-sm text-muted-foreground">valor total</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Itens do Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Mobile: card view */}
                        <div className="space-y-3 md:hidden">
                            {order.items.map((item: CartItem) => (
                                <div key={item.id} className="rounded-lg border p-4">
                                        <p className="font-medium">{formatItemName(item)}</p>
                                        {item.addons && item.addons.length > 0 && (
                                            <div className="mt-2 space-y-0.5">
                                                {item.addons.map((addon) => (
                                                    <span key={addon.id} className="block text-xs text-muted-foreground ml-1">
                                                        + {addon.name} {addon.price > 0 ? `(${formatPrice(addon.price)})` : '(Grátis)'}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="mt-3 space-y-1.5 text-sm">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Quantidade</span>
                                                <span className="font-medium text-foreground">{item.quantity}</span>
                                            </div>
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Preço Unit.</span>
                                                <span className="font-medium text-foreground">{formatPrice(getItemUnitPrice(item))}</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-1.5 text-muted-foreground">
                                                <span>Subtotal</span>
                                                <span className="font-semibold text-foreground">{formatPrice(getItemSubtotal(item))}</span>
                                            </div>
                                        </div>
                                    </div>
                            ))}
                            <div className="rounded-lg border bg-muted/50 p-4">
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop: table view */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-left font-medium">Produto</th>
                                        <th className="p-3 text-center font-medium">Qtd</th>
                                        <th className="p-3 text-right font-medium">Preço Unit.</th>
                                        <th className="p-3 text-right font-medium">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item: CartItem) => (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="p-3">
                                                <p className="font-medium">{formatItemName(item)}</p>
                                                {item.addons && item.addons.length > 0 && (
                                                    <div className="mt-1 space-y-0.5">
                                                        {item.addons.map((addon) => (
                                                            <span key={addon.id} className="block text-xs text-muted-foreground">
                                                                + {addon.name} {addon.price > 0 ? `(${formatPrice(addon.price)})` : '(Grátis)'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-3 text-center">{item.quantity}</td>
                                            <td className="p-3 text-right">{formatPrice(getItemUnitPrice(item))}</td>
                                            <td className="p-3 text-right font-medium">
                                                {formatPrice(getItemSubtotal(item))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={3} className="p-3 text-right font-bold">
                                            Total:
                                        </td>
                                        <td className="p-3 text-right font-bold">
                                            {formatPrice(order.total)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {order.notes && (
                    <Card className="mt-6">
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <FileText className="size-5 text-muted-foreground" />
                            <CardTitle className="text-base">Observações</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {order.address && (
                    <Card className="mt-6">
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <MapPin className="size-5 text-muted-foreground" />
                            <CardTitle className="text-base">Endereço de Entrega</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">
                                {order.address.street}, {order.address.number}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {order.address.neighborhood}, {order.address.city}
                            </p>
                            {order.address.zip_code && (
                                <p className="text-sm text-muted-foreground">CEP: {order.address.zip_code}</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {order.status === 'pending' && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-8">
                        <Button
                            onClick={() => updateStatus('rejected')}
                            variant="destructive"
                            className="gap-2 w-full sm:w-auto"
                        >
                            <X className="size-4" />
                            Recusar Pedido
                        </Button>
                        <Button
                            onClick={() => updateStatus('accepted')}
                            className="gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                        >
                            <Check className="size-4" />
                            Aceitar Pedido
                        </Button>
                    </div>
                )}

                {order.status === 'accepted' && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-8">
                        <Button
                            onClick={() => updateStatus('rejected')}
                            variant="destructive"
                            className="gap-2 w-full sm:w-auto"
                        >
                            <X className="size-4" />
                            Recusar
                        </Button>
                        <Button
                            onClick={() => updateStatus('preparing')}
                            className="gap-2 w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
                        >
                            <UtensilsCrossed className="size-4" />
                            Preparar
                        </Button>
                    </div>
                )}

                {order.status === 'preparing' && (
                    <div className="flex justify-end mt-8">
                        <Button
                            onClick={() => updateStatus('ready')}
                            className="gap-2 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                        >
                            <Check className="size-4" />
                            Pronto
                        </Button>
                    </div>
                )}

                {order.whatsapp_sent && (order.status === 'accepted' || order.status === 'preparing' || order.status === 'ready') && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                        Pedido aceito — notificação enviada para o WhatsApp do cliente.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}