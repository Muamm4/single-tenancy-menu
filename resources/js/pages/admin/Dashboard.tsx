import { type BreadcrumbItem, type Order } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Clock, ListOrdered, Package, ShoppingBag, Check, X } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatDate, getStatusBadgeVariant, getStatusLabel } from '@/lib/utils';
import { EmptyState } from '@/components/empty-state';

interface DashboardProps {
    totalCategories: number;
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    recentOrders: Order[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Painel Administrativo',
        href: '/admin',
    },
];

export default function Dashboard({
    totalCategories,
    totalProducts,
    totalOrders,
    pendingOrders,
    recentOrders,
}: DashboardProps) {
    const updateStatus = (id: number, status: 'accepted' | 'rejected') => {
        router.patch(route('admin.orders.update-status', id), {
            status,
        });
    };

    const stats = [
        {
            label: 'Total de Categorias',
            value: totalCategories,
            icon: Package,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            href: route('admin.categories.index'),
        },
        {
            label: 'Total de Produtos',
            value: totalProducts,
            icon: ShoppingBag,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            href: route('admin.products.index'),
        },
        {
            label: 'Total de Pedidos',
            value: totalOrders,
            icon: ListOrdered,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            href: route('admin.orders.index'),
        },
        {
            label: 'Pedidos Pendentes',
            value: pendingOrders,
            icon: Clock,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            href: route('admin.orders.index', { status: 'pending' }),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Painel Administrativo" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
                    <p className="text-muted-foreground">
                        Visão geral do seu restaurante
                    </p>
                </div>

                <div className="flex flex-col-reverse md:flex-col gap-6">
                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Link key={stat.label} href={stat.href}>
                            <Card className="border-t-2 border-t-primary cursor-pointer transition-shadow hover:shadow-md">
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`size-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Recent Orders */}
                <Card className="border-t-2 border-t-primary">
                    <CardContent className="p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Pedidos Recentes</h2>
                            <Link
                                href={route('admin.orders.index')}
                                className="text-sm text-primary hover:underline"
                            >
                                Ver todos
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <EmptyState
                                title="Nenhum pedido encontrado"
                            />
                        ) : (
                            <>
                                {/* Desktop table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b text-left text-sm text-muted-foreground">
                                                <th className="pb-3 font-medium">ID</th>
                                                <th className="pb-3 font-medium">Cliente</th>
                                                <th className="pb-3 font-medium">Status</th>
                                                <th className="pb-3 font-medium">Data</th>
                                                <th className="pb-3 font-medium">Total</th>
                                                <th className="pb-3 font-medium">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order) => (
                                                <tr key={order.id} className="border-b last:border-0">
                                                    <td className="py-3">#{order.id}</td>
                                                    <td className="py-3">{order.customer_name}</td>
                                                    <td className="py-3">
                                                        <Badge variant={getStatusBadgeVariant(order.status)}>
                                                            {getStatusLabel(order.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 text-sm text-muted-foreground">
                                                        {formatDate(order.created_at)}
                                                    </td>
                                                    <td className="py-3 font-medium">
                                                        {formatPrice(order.total)}
                                                    </td>
                                                 <td className="py-3">
                                                     <div className="flex items-center gap-2">
                                                         <Link
                                                             href={route('admin.orders.show', order.id)}
                                                             className="text-sm text-primary hover:underline"
                                                         >
                                                             Ver
                                                         </Link>
                                                         {order.status === 'pending' && (
                                                             <div className="flex items-center gap-1 ml-2 border-l pl-2">
                                                                 <Button
                                                                     size="icon"
                                                                     variant="ghost"
                                                                     className="size-7 h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                                     onClick={() => updateStatus(order.id, 'accepted')}
                                                                     title="Aceitar Pedido"
                                                                 >
                                                                     <Check className="size-3.5" />
                                                                 </Button>
                                                                 <Button
                                                                     size="icon"
                                                                     variant="ghost"
                                                                     className="size-7 h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                     onClick={() => updateStatus(order.id, 'rejected')}
                                                                     title="Recusar Pedido"
                                                                 >
                                                                     <X className="size-3.5" />
                                                                 </Button>
                                                             </div>
                                                         )}
                                                     </div>
                                                 </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile cards */}
                                <div className="md:hidden space-y-3">
                                    {recentOrders.map((order) => (
                                        <Card key={order.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold text-sm">#{order.id}</p>
                                                        <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                                                    </div>
                                                    <Badge variant={getStatusBadgeVariant(order.status)} className="text-[10px] px-2 py-0.5">
                                                        {getStatusLabel(order.status)}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-xs mb-2">
                                                    <span className="text-muted-foreground">{formatDate(order.created_at)}</span>
                                                    <span className="font-semibold">{formatPrice(order.total)}</span>
                                                </div>
                                                <div className="flex items-center justify-between pt-1.5 border-t">
                                                    <Link
                                                        href={route('admin.orders.show', order.id)}
                                                        className="text-sm font-medium text-primary hover:underline"
                                                    >
                                                        Ver detalhes
                                                    </Link>
                                                    {order.status === 'pending' && (
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                                                                onClick={() => updateStatus(order.id, 'accepted')}
                                                            >
                                                                <Check className="size-3.5 mr-1" />
                                                                Aceitar
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                                                                onClick={() => updateStatus(order.id, 'rejected')}
                                                            >
                                                                <X className="size-3.5 mr-1" />
                                                                Recusar
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
                </div>
            </div>
        </AppLayout>
    );
}