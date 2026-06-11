import { Link, usePage, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { Order } from '@/types';
import { Package, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/layouts/public-layout';
import { formatPrice, getStatusLabel, getStatusBadgeVariant } from '@/lib/utils';

interface OrdersProps {
    orders: Order[];
}

function getStatusIcon(status: Order['status']) {
    switch (status) {
        case 'pending': return Clock;
        case 'accepted': return CheckCircle;
        case 'rejected': return XCircle;
        default: return Clock;
    }
}

export default function Orders({ orders }: OrdersProps) {
    const { props } = usePage();
    const appColors = (props as any).appColors as Record<string, string> | undefined;
    const menuOnly = appColors?.menu_only === 'true';

    useEffect(() => {
        if (menuOnly) {
            router.visit(route('menu'));
        }
    }, [menuOnly]);

    return (
        <PublicLayout title="Meus Pedidos" description="Acompanhe o status dos seus pedidos">
            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="size-16 text-muted-foreground/40 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Nenhum pedido ainda</h2>
                    <p className="text-muted-foreground mb-6">Seus pedidos aparecerão aqui</p>
                    <Button asChild>
                        <Link href={route('menu')}>Ver Cardápio</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                            <Link key={order.id} href={route('customer.orders.show', order.id)} className="block">
                            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Package className="size-4 text-muted-foreground" />
                                            Pedido #{order.id}
                                        </CardTitle>
                                        <Badge variant={getStatusBadgeVariant(order.status)}>
                                            <StatusIcon className="size-3 mr-1" />
                                            {getStatusLabel(order.status)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between border-t pt-2 font-semibold">
                                            <span>Total</span>
                                            <span>{formatPrice(order.total)}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                                            <Calendar className="size-3" />
                                            {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                        );
                    })}
                </div>
            )}
        </PublicLayout>
    );
}
