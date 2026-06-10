import { type AddonCategory, type BreadcrumbItem, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Check, X, Eye } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface AddonCategoriesIndexProps {
    addonCategories: PaginatedResponse<AddonCategory>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Categorias de Adicionais', href: '/admin/addon-categories' },
];

export default function AddonCategoriesIndex({ addonCategories }: AddonCategoriesIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const handleDeleteClick = (id: number) => {
        setCategoryToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            router.delete(route('admin.addon-categories.destroy', categoryToDelete));
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias de Adicionais" />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Categorias de Adicionais</h1>
                        <p className="text-muted-foreground">
                            Gerencie as categorias de adicionais do seu cardápio
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.addon-categories.create')}>
                            <Plus className="mr-2 size-4" /> Nova Categoria
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {/* Mobile: Card Layout */}
                        <div className="md:hidden">
                            {addonCategories.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {addonCategories.data.map((cat) => (
                                        <div key={cat.id} className="flex flex-col gap-2 p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate font-semibold text-base">{cat.name}</div>
                                                    <div className="text-xs text-muted-foreground/60 mt-1">
                                                        Mín: {cat.min_select} | Máx: {cat.max_select}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {cat.is_active ? (
                                                        <Check className="size-5 text-green-500" />
                                                    ) : (
                                                        <X className="size-5 text-red-500" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-xs text-muted-foreground">Ordem: {cat.sort_order}</div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('admin.addons.index', { addonCategory: cat.id })}>
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('admin.addon-categories.edit', cat.id)}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(cat.id)}
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
                                            <th className="p-4 text-left font-medium">Nome</th>
                                            <th className="p-4 text-left font-medium">Mín</th>
                                            <th className="p-4 text-left font-medium">Máx</th>
                                            <th className="p-4 text-left font-medium">Ativo</th>
                                            <th className="p-4 text-left font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addonCategories.data.map((cat) => (
                                            <tr key={cat.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 font-medium">{cat.name}</td>
                                                <td className="p-4 text-muted-foreground">{cat.min_select}</td>
                                                <td className="p-4 text-muted-foreground">{cat.max_select}</td>
                                                <td className="p-4">
                                                    {cat.is_active ? (
                                                        <Check className="size-5 text-green-500" />
                                                    ) : (
                                                        <X className="size-5 text-red-500" />
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('admin.addons.index', { addonCategory: cat.id })}>
                                                                <Eye className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('admin.addon-categories.edit', cat.id)}>
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteClick(cat.id)}
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

                        {addonCategories.links && addonCategories.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1 border-t p-4">
                                {addonCategories.links.map((link, index) => {
                                    if (index === 0 || index === addonCategories.links.length - 1) {
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
                        <DialogTitle>Excluir Categoria de Adicional</DialogTitle>
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
