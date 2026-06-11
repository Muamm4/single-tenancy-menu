import { type BreadcrumbItem, type Category, type Product, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Check, X, Search, Package } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { Pagination } from '@/components/pagination';
import { DeleteDialog } from '@/components/delete-dialog';
import { EmptyState } from '@/components/empty-state';

interface ProductsIndexProps {
    products: PaginatedResponse<Product>;
    categories: Category[];
    filterCategory?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Produtos', href: '/admin/products' },
];

export default function ProductsIndex({ products, categories, filterCategory }: ProductsIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [search, setSearch] = useState('');

    const handleSearch = (value: string) => {
        setSearch(value);
        router.get(route('admin.products.index', { search: value }), {}, { preserveState: true });
    };

    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            router.delete(route('admin.products.destroy', productToDelete));
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const handleCategoryFilter = (value: string) => {
        if (value === 'all') {
            router.get(route('admin.products.index'));
        } else {
            router.get(route('admin.products.index', { category_id: value }));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Produtos" />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
                        <p className="text-muted-foreground">
                            Gerencie os produtos do seu cardápio
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.products.create')}>
                            <Plus className="mr-2 size-4" /> Novo Produto
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar produtos..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={filterCategory || 'all'}
                        onValueChange={handleCategoryFilter}
                    >
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Todas categorias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas categorias</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {products.data.length === 0 ? (
                            <EmptyState
                                icon={Package}
                                title="Nenhum produto encontrado"
                                description={filterCategory ? 'Tente selecionar outra categoria' : 'Clique em "Novo Produto" para adicionar'}
                            />
                        ) : (
                            <>
                                {/* Mobile card layout */}
                                <div className="block md:hidden divide-y">
                                    {products.data.map((product) => (
                                        <div key={product.id} className="flex items-center gap-3 p-4">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="size-12 shrink-0 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                    <Package className="size-5 text-muted-foreground/40" />
                                                </div>
                                            )}
                                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                                <p className="truncate font-medium">{product.name}</p>
                                                <p className="truncate text-xs text-muted-foreground/60">Ordem: {product.sort_order}</p>
                                                <div className="flex items-center gap-2">
                                                    {product.category?.name && (
                                                        <Badge variant="secondary" className="shrink-0">
                                                            {product.category.name}
                                                        </Badge>
                                                    )}
                                                    {product.is_active ? (
                                                        <Check className="size-4 shrink-0 text-green-500" />
                                                    ) : (
                                                        <X className="size-4 shrink-0 text-red-500" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{formatPrice(product.price)}</span>
                                                    {product.promotional_price && (
                                                        <span className="font-medium text-red-500">
                                                            {formatPrice(product.promotional_price)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-1">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('admin.products.edit', product.id)}>
                                                        <Pencil className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(product.id)}
                                                >
                                                    <Trash2 className="size-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Desktop table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b bg-muted/50">
                                            <tr>
                                                <th className="p-4 text-left font-medium w-16">Ordem</th>
                                                <th className="p-4 text-left font-medium">Imagem</th>
                                                <th className="p-4 text-left font-medium">Nome</th>
                                                <th className="p-4 text-left font-medium">Categoria</th>
                                                <th className="p-4 text-left font-medium">Preço</th>
                                                <th className="p-4 text-left font-medium">Promoção</th>
                                                <th className="p-4 text-left font-medium">Ativo</th>
                                                <th className="p-4 text-left font-medium">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.data.map((product) => (
                                                <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                                    <td className="p-4 text-muted-foreground text-center">{product.sort_order}</td>
                                                    <td className="p-4">
                                                        {product.image ? (
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={product.name}
                                                                className="size-12 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                                                                <Package className="size-5 text-muted-foreground/40" />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-medium">{product.name}</td>
                                                    <td className="p-4 text-muted-foreground">
                                                        {product.category?.name && (
                                                            <Badge variant="secondary">{product.category.name}</Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                                                    <td className="p-4">
                                                        {product.promotional_price ? (
                                                            <span className="font-medium text-red-500">
                                                                {formatPrice(product.promotional_price)}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">—</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {product.is_active ? (
                                                            <Check className="size-5 text-green-500" />
                                                        ) : (
                                                            <X className="size-5 text-red-500" />
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="ghost" size="icon" asChild>
                                                                <Link href={route('admin.products.edit', product.id)}>
                                                                    <Pencil className="size-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteClick(product.id)}
                                                            >
                                                                <Trash2 className="size-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        <Pagination links={products.links} />
                    </CardContent>
                </Card>
            </div>

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title="Excluir Produto"
                description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
            />
        </AppLayout>
    );
}