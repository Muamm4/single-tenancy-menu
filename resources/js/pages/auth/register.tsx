import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, MapPin, Phone } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zip_code: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        zip_code: '',
    });

    const [fetchingCep, setFetchingCep] = useState(false);

    const handleCepBlur = async () => {
        const cep = data.zip_code.replace(/\D/g, '');
        if (cep.length !== 8) return;

        setFetchingCep(true);
        try {
            const response = await fetch(`/api/cep/${cep}`);
            if (!response.ok) return;
            const result = await response.json();
            if (result.street) setData('street', result.street);
            if (result.neighborhood) setData('neighborhood', result.neighborhood);
            if (result.city) setData('city', result.city);
        } catch {
            // silently fail
        } finally {
            setFetchingCep(false);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Criar Conta" description="Crie sua conta para fazer pedidos">
            <Head title="Cadastro" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Seu nome completo"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="seu@email.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Telefone / WhatsApp</Label>
                        <Input
                            id="phone"
                            type="tel"
                            tabIndex={3}
                            autoComplete="tel"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="(11) 99999-9999"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Sua senha"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmar senha</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirme sua senha"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-3">
                            <MapPin className="size-4" />
                            Endereço de entrega (opcional)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2 grid gap-1">
                                <Label htmlFor="street" className="text-xs">Rua</Label>
                                <Input
                                    id="street"
                                    type="text"
                                    tabIndex={6}
                                    value={data.street}
                                    onChange={(e) => setData('street', e.target.value)}
                                    disabled={processing}
                                    placeholder="Rua, Avenida..."
                                    className="h-9 text-sm"
                                />
                                <InputError message={errors.street} />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="number" className="text-xs">Número</Label>
                                <Input
                                    id="number"
                                    type="text"
                                    tabIndex={7}
                                    value={data.number}
                                    onChange={(e) => setData('number', e.target.value)}
                                    disabled={processing}
                                    placeholder="Nº"
                                    className="h-9 text-sm"
                                />
                                <InputError message={errors.number} />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="zip_code" className="text-xs">CEP</Label>
                                <Input
                                    id="zip_code"
                                    type="text"
                                    tabIndex={8}
                                    value={data.zip_code}
                                    onChange={(e) => setData('zip_code', e.target.value)}
                                    onBlur={handleCepBlur}
                                    disabled={processing || fetchingCep}
                                    placeholder="00000-000"
                                    className="h-9 text-sm"
                                />
                                <InputError message={errors.zip_code} />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="neighborhood" className="text-xs">Bairro</Label>
                                <Input
                                    id="neighborhood"
                                    type="text"
                                    tabIndex={9}
                                    value={data.neighborhood}
                                    onChange={(e) => setData('neighborhood', e.target.value)}
                                    disabled={processing}
                                    placeholder="Bairro"
                                    className="h-9 text-sm"
                                />
                                <InputError message={errors.neighborhood} />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="city" className="text-xs">Cidade</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    tabIndex={10}
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    disabled={processing}
                                    placeholder="Cidade"
                                    className="h-9 text-sm"
                                />
                                <InputError message={errors.city} />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={11} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Criar Conta
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Já tem conta?{' '}
                    <TextLink href={route('login')} tabIndex={12}>
                        Entrar
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
