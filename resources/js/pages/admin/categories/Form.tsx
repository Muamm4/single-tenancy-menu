import { type BreadcrumbItem, type Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useRef } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

interface CategoryFormProps {
    category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const isEditing = !!category;

    const { data, setData, post, put, errors, processing } = useForm({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        image: null as File | null,
        is_active: category?.is_active ?? true,
        sort_order: category?.sort_order || 0,
    });

    const imageInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Categorias', href: route('admin.categories.index') },
        { title: isEditing ? 'Editar Categoria' : 'Nova Categoria', href: '#' },
    ];

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData('name', name);
        if (!isEditing || !category?.slug) {
            setData('slug', generateSlug(name));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.categories.update', category.id));
        } else {
            post(route('admin.categories.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Editar Categoria' : 'Nova Categoria'} />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Atualize as informações da categoria' : 'Crie uma nova categoria para o cardápio'}
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
                                        onChange={handleNameChange}
                                        placeholder="Nome da categoria"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="slug-da-categoria"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Descrição da categoria (opcional)"
                                    className="min-h-[100px]"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Imagem</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    ref={imageInputRef}
                                />
                                <InputError message={errors.image} />
                                {category?.image && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-2">Imagem atual:</p>
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt={category.name}
                                            className="size-24 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', !!checked)}
                                    />
                                    <Label htmlFor="is_active" className="font-normal">
                                        Categoria ativa
                                    </Label>
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

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('admin.categories.index')}>
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