import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Clock } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { BreadcrumbItem } from '@/types';

interface DayHours {
    day: number;
    open: string;
    close: string;
    closed: boolean;
}

interface BusinessHoursProps {
    hours: DayHours[];
}

const DAY_NAMES = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
];

const DEFAULT_HOURS: DayHours[] = Array.from({ length: 7 }, (_, i) => ({
    day: i,
    open: '09:00',
    close: '22:00',
    closed: false,
}));

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Painel Administrativo', href: '/admin' },
    { title: 'Horários', href: '/admin/settings/business-hours' },
];

export default function BusinessHours({ hours }: BusinessHoursProps) {
    const { errors, flash } = usePage().props as any;

    const [days, setDays] = useState<DayHours[]>(() => {
        if (hours && hours.length === 7) {
            return hours.map((h) => ({
                day: h.day,
                open: h.open || '09:00',
                close: h.close || '22:00',
                closed: h.closed ?? false,
            }));
        }
        return DEFAULT_HOURS;
    });

    const updateDay = (index: number, field: keyof DayHours, value: string | boolean) => {
        setDays((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(route('admin.settings.business-hours.update'), {
            hours: days,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Horários de Funcionamento" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Horários de Funcionamento</h1>
                    <p className="text-muted-foreground">
                        Defina os horários de abertura e fechamento do seu restaurante
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {days.map((day, index) => (
                            <Card key={day.day}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Clock className="size-4" />
                                        {DAY_NAMES[day.day]}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={`closed-${day.day}`}>Fechado</Label>
                                        <Switch
                                            id={`closed-${day.day}`}
                                            checked={day.closed}
                                            onCheckedChange={(checked) => updateDay(index, 'closed', checked)}
                                        />
                                    </div>

                                    {!day.closed && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor={`open-${day.day}`}>Abertura</Label>
                                                <Input
                                                    id={`open-${day.day}`}
                                                    type="time"
                                                    value={day.open}
                                                    onChange={(e) => updateDay(index, 'open', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`close-${day.day}`}>Fechamento</Label>
                                                <Input
                                                    id={`close-${day.day}`}
                                                    type="time"
                                                    value={day.close}
                                                    onChange={(e) => updateDay(index, 'close', e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {errors[`hours.${index}.open`] && (
                                        <p className="text-sm text-destructive">{errors[`hours.${index}.open`]}</p>
                                    )}
                                    {errors[`hours.${index}.close`] && (
                                        <p className="text-sm text-destructive">{errors[`hours.${index}.close`]}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {errors?.hours && (
                        <p className="mt-2 text-sm text-destructive">{errors.hours}</p>
                    )}

                    <div className="mt-6 flex justify-end">
                        <Button type="submit">Salvar Horários</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
