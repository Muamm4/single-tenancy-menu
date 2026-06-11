import { router } from '@inertiajs/react';
import { type CartItem, type Order } from '@/types';
import { ArrowLeft, Clock, CheckCircle, XCircle, ChefHat, ShoppingBag, FileText, MapPin, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/layouts/public-layout';
import { formatPrice, getStatusBadgeVariant, getStatusLabel } from '@/lib/utils';

interface OrderShowProps {
    order: Order;
}

function getStatusIcon(status: Order['status']) {
    switch (status) {
        case 'pending': return Clock;
        case 'accepted': return CheckCircle;
        case 'rejected': return XCircle;
        case 'preparing': return ChefHat;
        case 'ready': return ShoppingBag;
        default: return Clock;
    }
}

export default function OrderShow({ order }: OrderShowProps) {
    const StatusIcon = getStatusIcon(order.status);

    const getItemSubtotal = (item: CartItem): number => {
        return item.subtotal || item.price * item.quantity;
    };

    const pageHeader = (
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
            <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.visit(route('customer.orders'))}
                    className="shrink-0"
                >
                    <ArrowLeft className="size-5" />
                </Button>
                <h1 className="font-semibold text-lg truncate">Pedido #{order.id}</h1>
            </div>
        </header>
    );

    return (
        <PublicLayout
            title={`Pedido #${order.id}`}
            customHeader={pageHeader}
            maxWidth="none"
        >
            <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

                {/* Status banner */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className={`rounded-full p-3 ${
                                order.status === 'rejected' ? 'bg-destructive/10' :
                                order.status === 'ready' ? 'bg-green-100 dark:bg-green-900/30' :
                                'bg-primary/10'
                            }`}>
                                <StatusIcon className={`size-8 ${
                                    order.status === 'rejected' ? 'text-destructive' :
                                    order.status === 'ready' ? 'text-green-600 dark:text-green-400' :
                                    'text-primary'
                                }`} />
                            </div>
                            <div>
                                <Badge variant={getStatusBadgeVariant(order.status)} className="px-3 py-1 text-sm">
                                    {getStatusLabel(order.status)}
                                </Badge>
                                <p className="text-sm text-muted-foreground mt-1">
                                    <span>{getStatusDescription(order.status)}</span>
                                    <span className="block text-xs text-muted-foreground/60 mt-1">
                                        {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit', month: 'long', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Package className="size-4 text-muted-foreground" />
                            Itens do Pedido
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {order.items.map((item: CartItem, idx: number) => (
                                <div key={idx} className="rounded-lg border p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{item.product_name || item.name}</p>
                                            {item.addons && item.addons.length > 0 && (
                                                <div className="mt-1.5 space-y-0.5">
                                                    {item.addons.map((addon: any) => (
                                                        <span key={addon.id} className="block text-xs text-muted-foreground">
                                                            + {addon.name} {addon.price > 0 ? `(${formatPrice(addon.price)})` : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium whitespace-nowrap ml-4">
                                            {item.quantity}x
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-2 pt-2 border-t text-sm">
                                        <span className="text-muted-foreground">{formatPrice(item.price)} cada</span>
                                        <span className="font-semibold">{formatPrice(getItemSubtotal(item))}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <span className="text-base font-bold">Total</span>
                            <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                {order.notes && (
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <FileText className="size-4 text-muted-foreground" />
                            <CardTitle className="text-base">Observações</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Address */}
                {order.address && (
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-3 pb-2">
                            <MapPin className="size-4 text-muted-foreground" />
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

            </div>
        </PublicLayout>
    );
}

function getStatusDescription(status: Order['status']) {
    switch (status) {
        case 'pending': return 'Aguardando confirmação do restaurante';
        case 'accepted': return 'Seu pedido foi aceito! Estamos preparando';
        case 'preparing': return 'Seu pedido está sendo preparado';
        case 'ready': return 'Seu pedido está pronto!';
        case 'rejected': return 'Pedido não foi aceito';
        default: return '';
    }
}
