import { type BreadcrumbItem, type Category, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface CategoriesIndexProps {
    categories: PaginatedResponse<Category>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Categorias', href: '/admin/categories' },
];

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setCategoryToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            router.delete(route('admin.categories.destroy', categoryToDelete));
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias" />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
                        <p className="text-muted-foreground">
                            Gerencie as categorias do seu cardápio
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.categories.create')}>
                            <Plus className="mr-2 size-4" /> Nova Categoria
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {/* Mobile: Card Layout */}
                        <div className="md:hidden">
                            {categories.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {categories.data.map((category) => (
                                        <div key={category.id} className="flex flex-col gap-2 p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate font-semibold text-base">{category.name}</div>
                                                        <div className="truncate text-sm text-muted-foreground">{category.slug}</div>
                                                        <div className="text-xs text-muted-foreground/60 mt-1">Ordem: {category.sort_order}</div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {category.is_active ? (
                                                        <Check className="size-5 text-green-500" />
                                                    ) : (
                                                        <X className="size-5 text-red-500" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <Badge variant="secondary">{category.products_count ?? 0} produtos</Badge>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('admin.categories.edit', category.id)}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(category.id)}
                                                    >
                                                        <Trash2 className="size-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Desktop: Table */}
                        <div className="hidden md:block">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr>
                                            <th className="p-4 text-left font-medium w-16">Ordem</th>
                                            <th className="p-4 text-left font-medium">Nome</th>
                                            <th className="p-4 text-left font-medium">Slug</th>
                                            <th className="p-4 text-left font-medium">Produtos</th>
                                            <th className="p-4 text-left font-medium">Ativo</th>
                                            <th className="p-4 text-left font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.data.map((category) => (
                                            <tr key={category.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 text-muted-foreground text-center">{category.sort_order}</td>
                                                <td className="p-4 font-medium">{category.name}</td>
                                                <td className="p-4 text-muted-foreground">{category.slug}</td>
                                                <td className="p-4">{category.products_count}</td>
                                                <td className="p-4">
                                                    {category.is_active ? (
                                                        <Check className="size-5 text-green-500" />
                                                    ) : (
                                                        <X className="size-5 text-red-500" />
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('admin.categories.edit', category.id)}>
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteClick(category.id)}
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
                        </div>

                        {categories.links && categories.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1 border-t p-4">
                                {categories.links.map((link, index) => {
                                    if (index === 0 || index === categories.links.length - 1) {
                                        return null;
                                    }
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`flex size-8 items-center justify-center rounded text-sm ${
                                                link.active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-muted'
                                            }`}
                                            preserveScroll
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Categoria</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}