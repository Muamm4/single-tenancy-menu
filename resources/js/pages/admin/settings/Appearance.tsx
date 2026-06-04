import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Store } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BreadcrumbItem } from '@/types';

interface AppearanceProps {
    colors: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Painel Administrativo', href: '/admin' },
    { title: 'Aparência', href: '/admin/settings/appearance' },
];

export default function Appearance({ colors }: AppearanceProps) {
    const { errors, flash } = usePage().props as any;

    const [primaryColor, setPrimaryColor] = useState(colors.primary_color || '#2C402E');
    const [primaryForeground, setPrimaryForeground] = useState(colors.primary_foreground || '#ffffff');
    const [background, setBackground] = useState(colors.background || '#FBF9F5');
    const [foreground, setForeground] = useState(colors.foreground || '#1E221F');
    const [headerBackground, setHeaderBackground] = useState(colors.header_background || '#2C402E');
    const [headerForeground, setHeaderForeground] = useState(colors.header_foreground || '#ffffff');
    const [restaurantName, setRestaurantName] = useState(colors.restaurant_name || '');

    const previewStyle = {
        '--preview-primary': primaryColor,
        '--preview-primary-foreground': primaryForeground,
        '--preview-background': background,
        '--preview-foreground': foreground,
        '--preview-header': headerBackground,
        '--preview-header-foreground': headerForeground,
    } as React.CSSProperties;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.patch(route('admin.settings.appearance.update'), {
            primary_color: primaryColor,
            primary_foreground: primaryForeground,
            background,
            foreground,
            header_background: headerBackground,
            header_foreground: headerForeground,
            restaurant_name: restaurantName,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Aparência" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Personalizar Aparência</h1>
                    <p className="text-muted-foreground">
                        Altere as cores do seu cardápio digital
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Store className="size-5" />
                                        Identificação
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="restaurant_name">Nome do restaurante</Label>
                                        <Input
                                            id="restaurant_name"
                                            type="text"
                                            value={restaurantName}
                                            onChange={(e) => setRestaurantName(e.target.value)}
                                            placeholder="Meu Restaurante"
                                        />
                                        {errors?.restaurant_name && (
                                            <p className="text-sm text-destructive">{errors.restaurant_name}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Cores da Marca</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ColorField
                                        id="primary_color"
                                        label="Cor primária"
                                        value={primaryColor}
                                        onChange={setPrimaryColor}
                                        error={errors?.primary_color}
                                    />
                                    <ColorField
                                        id="primary_foreground"
                                        label="Cor do texto sobre primária"
                                        value={primaryForeground}
                                        onChange={setPrimaryForeground}
                                        error={errors?.primary_foreground}
                                    />
                                    <ColorField
                                        id="header_background"
                                        label="Fundo do cabeçalho"
                                        value={headerBackground}
                                        onChange={setHeaderBackground}
                                        error={errors?.header_background}
                                    />
                                    <ColorField
                                        id="header_foreground"
                                        label="Texto do cabeçalho"
                                        value={headerForeground}
                                        onChange={setHeaderForeground}
                                        error={errors?.header_foreground}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Cores de Fundo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ColorField
                                        id="background"
                                        label="Cor de fundo da página"
                                        value={background}
                                        onChange={setBackground}
                                        error={errors?.background}
                                    />
                                    <ColorField
                                        id="foreground"
                                        label="Cor do texto"
                                        value={foreground}
                                        onChange={setForeground}
                                        error={errors?.foreground}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pré-visualização</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div
                                    style={previewStyle}
                                    className="space-y-3 overflow-hidden rounded-lg border"
                                >
                                    <div
                                        className="px-4 py-6 text-center"
                                        style={{
                                            backgroundColor: 'var(--preview-header)',
                                            color: 'var(--preview-header-foreground)',
                                        }}
                                    >
                                        <p className="text-lg font-bold">{restaurantName || 'Cardápio Digital'}</p>
                                        <p className="mt-1 text-sm opacity-90">
                                            Escolha seus produtos favoritos
                                        </p>
                                    </div>

                                    <div
                                        className="space-y-4 p-4 pt-2"
                                        style={{
                                            backgroundColor: 'var(--preview-background)',
                                            color: 'var(--preview-foreground)',
                                        }}
                                    >
                                        <div className="flex gap-2 overflow-x-auto">
                                            <button
                                                type="button"
                                                className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium"
                                                style={{
                                                    backgroundColor: 'var(--preview-primary)',
                                                    color: 'var(--preview-primary-foreground)',
                                                }}
                                            >
                                                Categoria Ativa
                                            </button>
                                            <button
                                                type="button"
                                                className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium"
                                                style={{
                                                    backgroundColor: 'oklch(0.97 0 0)',
                                                    color: 'var(--preview-foreground)',
                                                }}
                                            >
                                                Outra
                                            </button>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                                                style={{
                                                    backgroundColor: 'var(--preview-primary)',
                                                    color: 'var(--preview-primary-foreground)',
                                                }}
                                            >
                                                Botão Primário
                                            </button>
                                            <button
                                                type="button"
                                                className="rounded-md border px-4 py-2 text-sm font-medium"
                                                style={{
                                                    borderColor: 'oklch(0.922 0 0)',
                                                    backgroundColor: 'var(--preview-background)',
                                                    color: 'var(--preview-foreground)',
                                                }}
                                            >
                                                Botão Secundário
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    As cores alteradas serão aplicadas em todo o cardápio público e painel admin após salvar.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit">Salvar Cores</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function ColorField({
    id,
    label,
    value,
    onChange,
    error,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex gap-3">
                <Input
                    id={id}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="size-10 cursor-pointer p-1"
                />
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 font-mono"
                />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
