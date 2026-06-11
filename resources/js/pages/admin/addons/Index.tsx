import { type Addon, type AddonCategory, type BreadcrumbItem, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Check, X, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

interface AddonsIndexProps {
    addonCategory: AddonCategory;
    addons: PaginatedResponse<Addon>;
}

export default function AddonsIndex({ addonCategory, addons }: AddonsIndexProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addonToDelete, setAddonToDelete] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Categorias de Adicionais', href: route('admin.addon-categories.index') },
        { title: `Adicionais: ${addonCategory.name}`, href: '#' },
    ];

    const handleDeleteClick = (id: number) => {
        setAddonToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (addonToDelete) {
            router.delete(route('admin.addons.destroy', addonToDelete));
            setDeleteDialogOpen(false);
            setAddonToDelete(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Adicionais: ${addonCategory.name}`} />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={route('admin.addon-categories.index')}>
                                    <ArrowLeft className="size-4 mr-1" />
                                    Voltar
                                </Link>
                            </Button>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Adicionais</h1>
                        <p className="text-muted-foreground">
                            Gerenciando adicionais da categoria: <strong>{addonCategory.name}</strong>
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('admin.addons.create', { addon_category_id: addonCategory.id })}>
                            <Plus className="mr-2 size-4" /> Novo Adicional
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {/* Mobile: Card Layout */}
                        <div className="md:hidden">
                            {addons.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-sm text-muted-foreground">Nenhum adicional encontrado</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {addons.data.map((addon) => (
                                        <div key={addon.id} className="flex flex-col gap-2 p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="truncate font-semibold text-base">{addon.name}</div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        {formatPrice(addon.price)}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {addon.is_active ? (
                                                        <Check className="size-5 text-green-500" />
                                                    ) : (
                                                        <X className="size-5 text-red-500" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-xs text-muted-foreground">Ordem: {addon.sort_order}</div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={route('admin.addons.edit', addon.id)}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteClick(addon.id)}
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
                                            <th className="p-4 text-left font-medium">Preço</th>
                                            <th className="p-4 text-left font-medium">Ativo</th>
                                            <th className="p-4 text-left font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addons.data.map((addon) => (
                                            <tr key={addon.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 text-muted-foreground text-center">{addon.sort_order}</td>
                                                <td className="p-4 font-medium">{addon.name}</td>
                                                <td className="p-4 font-medium">{formatPrice(addon.price)}</td>
                                                <td className="p-4">
                                                    {addon.is_active ? (
                                                        <Check className="size-5 text-green-500" />
                                                    ) : (
                                                        <X className="size-5 text-red-500" />
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={route('admin.addons.edit', addon.id)}>
                                                                <Pencil className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteClick(addon.id)}
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

                        {addons.links && addons.links.length > 3 && (
                            <div className="flex items-center justify-center gap-1 border-t p-4">
                                {addons.links.map((link, index) => {
                                    if (index === 0 || index === addons.links.length - 1) {
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
                        <DialogTitle>Excluir Adicional</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir este adicional? Esta ação não pode ser desfeita.
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
