import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        pending: 'secondary',
        accepted: 'default',
        rejected: 'destructive',
        preparing: 'outline',
        ready: 'default',
    };
    return variants[status] || 'secondary';
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'Pendente',
        accepted: 'Aceito',
        rejected: 'Recusado',
        preparing: 'Preparando',
        ready: 'Pronto',
    };
    return labels[status] || status;
}
