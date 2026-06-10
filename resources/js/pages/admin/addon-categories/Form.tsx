import { type AddonCategory, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import InputError from '@/components/input-error';

interface AddonCategoryFormProps {
    addonCategory?: AddonCategory;
}

export default function AddonCategoryForm({ addonCategory }: AddonCategoryFormProps) {
    const isEditing = !!addonCategory;

    const { data, setData, post, put, errors, processing } = useForm({
        name: addonCategory?.name || '',
        min_select: addonCategory?.min_select || 0,
        max_select: addonCategory?.max_select || 0,
        is_active: addonCategory?.is_active ?? true,
        sort_order: addonCategory?.sort_order || 0,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Categorias de Adicionais', href: route('admin.addon-categories.index') },
        { title: isEditing ? 'Editar Categoria' : 'Nova Categoria', href: '#' },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.addon-categories.update', addonCategory.id));
        } else {
            post(route('admin.addon-categories.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Editar Categoria de Adicional' : 'Nova Categoria de Adicional'} />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEditing ? 'Editar Categoria de Adicional' : 'Nova Categoria de Adicional'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing
                                ? 'Atualize as informações da categoria de adicional'
                                : 'Crie uma nova categoria de adicional para o cardápio'}
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
                                        placeholder="Nome da categoria"
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
                                    <Label htmlFor="min_select">Mínimo de seleções</Label>
                                    <Input
                                        id="min_select"
                                        type="number"
                                        value={data.min_select}
                                        onChange={(e) => setData('min_select', parseInt(e.target.value) || 0)}
                                        min="0"
                                        placeholder="0"
                                    />
                                    <InputError message={errors.min_select} />
                                    <p className="text-xs text-muted-foreground">
                                        Quantidade mínima de adicionais que o cliente deve selecionar (0 para nenhum)
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="max_select">Máximo de seleções</Label>
                                    <Input
                                        id="max_select"
                                        type="number"
                                        value={data.max_select}
                                        onChange={(e) => setData('max_select', parseInt(e.target.value) || 0)}
                                        min="0"
                                        placeholder="0"
                                    />
                                    <InputError message={errors.max_select} />
                                    <p className="text-xs text-muted-foreground">
                                        Quantidade máxima de adicionais que o cliente pode selecionar (0 para ilimitado)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active" className="font-normal">
                                    Categoria ativa
                                </Label>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('admin.addon-categories.index')}>
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
