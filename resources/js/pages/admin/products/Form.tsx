import { type AddonCategory, type BreadcrumbItem, type Category, type Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';

interface ProductFormProps {
    product?: Product;
    categories: Category[];
    addonCategories?: AddonCategory[];
}

export default function ProductForm({ product, categories, addonCategories = [] }: ProductFormProps) {
    const isEditing = !!product;

    const initialAddonIds = product?.addon_categories?.map((c) => c.id) || [];
    const [hasAddons, setHasAddons] = useState(initialAddonIds.length > 0);

    const { data, setData, post, put, errors, processing } = useForm({
        name: product?.name || '',
        category_id: product?.category_id?.toString() || '',
        description: product?.description || '',
        price: product?.price || 0,
        promotional_price: product?.promotional_price || null as number | null,
        image: null as File | null,
        remove_image: false,
        is_active: product?.is_active ?? true,
        sort_order: product?.sort_order || 0,
        addon_category_ids: initialAddonIds,
    });

    const imageInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Produtos', href: route('admin.products.index') },
        { title: isEditing ? 'Editar Produto' : 'Novo Produto', href: '#' },
    ];

const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.products.update', product.id));
        } else {
            post(route('admin.products.store'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Editar Produto' : 'Novo Produto'} />
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {isEditing ? 'Editar Produto' : 'Novo Produto'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Atualize as informações do produto' : 'Adicione um novo produto ao cardápio'}
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
                                        placeholder="Nome do produto"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="category_id">Categoria</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) => setData('category_id', value)}
                                        required
                                    >
                                        <SelectTrigger id="category_id">
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descrição</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Descrição do produto (opcional)"
                                    className="min-h-[100px]"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
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
                                    <p className="text-xs text-muted-foreground">Informe o preço do produto</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="promotional_price">Preço Promocional</Label>
                                    <Input
                                        id="promotional_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.promotional_price ?? ''}
                                        onChange={(e) => setData('promotional_price', e.target.value ? parseFloat(e.target.value) : null)}
                                        placeholder="Deixe vazio se não for promoção"
                                    />
                                    <InputError message={errors.promotional_price} />
                                    <p className="text-xs text-muted-foreground">Preencha para ativar promoção</p>
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
                                    <p className="text-xs text-muted-foreground">Quanto menor o número, mais para o início da lista</p>
                                </div>
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
                                {product?.image && !data.remove_image && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-2">Imagem atual:</p>
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="size-24 rounded-lg object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setData('remove_image', true)}
                                            >
                                                Remover foto
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {data.remove_image && (
                                    <p className="mt-2 text-sm text-destructive">Foto será removida ao salvar.</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active" className="font-normal">
                                    Produto ativo
                                </Label>
                            </div>

                            <div className="space-y-4 border-t pt-6">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="has_addons"
                                        checked={hasAddons}
                                        onCheckedChange={setHasAddons}
                                    />
                                    <Label htmlFor="has_addons">Tem adicional?</Label>
                                </div>

                                {hasAddons && (
                                    <div className="ml-6 space-y-2">
                                        <Label>Categorias de adicionais disponíveis</Label>
                                        {addonCategories.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                Nenhuma categoria de adicional cadastrada.{' '}
                                                <Link href={route('admin.addon-categories.create')} className="underline">
                                                    Criar categoria
                                                </Link>
                                            </p>
                                        ) : (
                                            <div className="grid gap-2">
                                                {addonCategories.map((cat) => (
                                                    <label
                                                        key={cat.id}
                                                        className="flex items-center gap-2 rounded-lg border p-3 cursor-pointer hover:bg-accent"
                                                    >
                                                        <Checkbox
                                                            checked={data.addon_category_ids?.includes(cat.id)}
                                                            onCheckedChange={(checked) => {
                                                                const current = data.addon_category_ids || [];
                                                                if (checked) {
                                                                    setData('addon_category_ids', [...current, cat.id]);
                                                                } else {
                                                                    setData('addon_category_ids', current.filter((id) => id !== cat.id));
                                                                }
                                                            }}
                                                        />
                                                        <div>
                                                            <span className="font-medium">{cat.name}</span>
                                                            {cat.min_select > 0 && (
                                                                <span className="text-xs text-muted-foreground ml-2">
                                                                    Mín: {cat.min_select}
                                                                </span>
                                                            )}
                                                            {cat.max_select > 0 && (
                                                                <span className="text-xs text-muted-foreground ml-2">
                                                                    Máx: {cat.max_select}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={route('admin.products.index')}>
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