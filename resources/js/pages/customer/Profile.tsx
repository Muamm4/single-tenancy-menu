import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { User, Phone, Mail, Save, MapPin, Plus, Trash2, CheckCircle, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLayout } from '@/layouts/public-layout';

interface Address {
    id: number;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zip_code: string;
    is_default: boolean;
}

interface ProfileProps {
    auth: {
        user: {
            name: string;
            email: string;
            phone?: string;
            is_admin?: boolean;
        };
    };
    addresses: Address[];
    defaultAddress: Address | null;
}

export default function Profile({ auth, addresses = [], defaultAddress = null }: ProfileProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone || '',
    });

    const addressForm = useForm({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        zip_code: '',
        is_default: false,
    });

    const [loadingCep, setLoadingCep] = useState(false);

    const handleCepChange = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
        addressForm.setData('zip_code', masked);
    };

    const lookupCep = async () => {
        const raw = addressForm.data.zip_code.replace(/\D/g, '');
        if (raw.length !== 8) return;

        setLoadingCep(true);
        try {
            const response = await fetch(`/api/cep/${raw}`);
            if (!response.ok) return;
            const data = await response.json();
            addressForm.setData('street', data.street || '');
            addressForm.setData('neighborhood', data.neighborhood || '');
            addressForm.setData('city', data.city || '');
        } catch {
        } finally {
            setLoadingCep(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const handleAddAddress = (e: React.FormEvent) => {
        e.preventDefault();
        addressForm.post(route('addresses.store'), {
            onSuccess: () => addressForm.reset(),
            preserveScroll: true,
        });
    };

    const handleSetDefault = (id: number) => {
        router.patch(route('addresses.update', id), { is_default: true });
    };

    const handleDeleteAddress = (id: number) => {
        if (confirm('Tem certeza que deseja excluir este endereço?')) {
            router.delete(route('addresses.destroy', id));
        }
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <PublicLayout title="Minha Conta" description="Gerencie seus dados e preferências">
            <div className="max-w-md mx-auto space-y-6 mb-16">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="size-5" />
                            Informações Pessoais
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full gap-2">
                                <Save className="size-4" />
                                Salvar Alterações
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="size-5" />
                            Meus Endereços
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            {addresses.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum endereço cadastrado.
                                </p>
                            ) : (
                                addresses.map((address) => (
                                    <div key={address.id} className={`p-3 rounded-xl border transition-all ${address.is_default ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-card'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                {address.is_default && <Badge className="text-[10px] h-4 px-1">Padrão</Badge>}
                                                <span className="text-sm font-medium">{address.street}, {address.number}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {!address.is_default && (
                                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1" onClick={() => handleSetDefault(address.id)}>
                                                        <CheckCircle className="size-3" />
                                                        Padrão
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-destructive hover:text-destructive" onClick={() => handleDeleteAddress(address.id)}>
                                                    <Trash2 className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {address.neighborhood}, {address.city} - {address.zip_code}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
                                <Plus className="size-3.5" />
                                Adicionar Novo Endereço
                            </h4>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddAddress(e); }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2 space-y-1">
                                    <Label className="text-xs">CEP</Label>
                                    <div className="relative">
                                        <Input
                                            value={addressForm.data.zip_code}
                                            onChange={e => handleCepChange(e.target.value)}
                                            onBlur={lookupCep}
                                            className="h-8 text-sm pr-8"
                                            placeholder="Digite o CEP"
                                            maxLength={9}
                                        />
                                        {loadingCep && (
                                            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 animate-pulse text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <Label className="text-xs">Rua</Label>
                                    <Input value={addressForm.data.street} onChange={e => addressForm.setData('street', e.target.value)} className="h-8 text-sm" placeholder="Nome da rua" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Número</Label>
                                    <Input value={addressForm.data.number} onChange={e => addressForm.setData('number', e.target.value)} className="h-8 text-sm" placeholder="Nº" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Bairro</Label>
                                    <Input value={addressForm.data.neighborhood} onChange={e => addressForm.setData('neighborhood', e.target.value)} className="h-8 text-sm" placeholder="Bairro" />
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <Label className="text-xs">Cidade</Label>
                                    <Input value={addressForm.data.city} onChange={e => addressForm.setData('city', e.target.value)} className="h-8 text-sm" placeholder="Cidade" />
                                </div>
                                <Button type="submit" disabled={addressForm.processing} className="sm:col-span-2 gap-2 h-9">
                                    <Plus className="size-4" />
                                    Salvar Endereço
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>

                {auth.user.is_admin && (
                    <Button asChild variant="default" className="w-full gap-2 py-6">
                        <Link href="/admin">
                            <LayoutDashboard className="size-4" />
                            Painel Administrativo
                        </Link>
                    </Button>
                )}

                <Button variant="destructive" onClick={handleLogout} className="w-full gap-2 py-6">
                    <LogOut className="size-4" />
                    Sair da Conta
                </Button>
            </div>
        </PublicLayout>
    );
}
