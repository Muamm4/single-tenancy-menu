import { type Addon, type AddonCategory, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';

interface AddonFormProps {
    addon?: Addon;
    addonCategory: AddonCategory;
}

export default function AddonForm({ addon, addonCategory }: AddonFormProps) {
    const isEditing = !!addon;

    const { data, setData, post, put, errors, processing } = useForm({
        addon_category_id: addon?.addon_category_id || addonCategory.id,
        name: addon?.name || '',
        price: addon?.price || 0,
        is_active: addon?.is_active ?? true,
        sort_order: addon?.sort_order || 0,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Categorias de Adicionais', href: route('admin.addon-categories.index') },
        { title: `Adicionais: ${addonCategory.name}`, href: route('admin.addons.index', { addonCategory: addonCategory.id }) },
        { title: isEditing ? 'Editar Adicional' : 'Novo Adicional', href: '#' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.addons.update', addon.id));
        } else {
            post(route('admin.addons.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Editar Adicional' : 'Novo Adicional'} />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEditing ? 'Editar Adicional' : 'Novo Adicional'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing
                                ? 'Atualize as informações do adicional'
                                : `Adicione um novo adicional à categoria: ${addonCategory.name}`}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nome do adicional"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sort_order">Ordem de exibição</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                    <InputError message={errors.sort_order} />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Preço</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                        placeholder="0,00"
                                        required
                                    />
                                    <InputError message={errors.price} />
                                    <p className="text-xs text-muted-foreground">
                                        Preço adicional que será somado ao produto
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-6">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked)}
                                    />
                                    <Label htmlFor="is_active" className="font-normal">
                                        Adicional ativo
                                    </Label>
                                </div>
                            </div>

                            <input type="hidden" name="addon_category_id" value={data.addon_category_id} />

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('admin.addons.index', { addonCategory: addonCategory.id })}>
                                        Cancelar
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
