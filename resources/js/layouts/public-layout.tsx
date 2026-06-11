import { Head } from '@inertiajs/react';
import { BottomNav } from '@/components/public/BottomNav';
import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
    showBack?: boolean;
    headerRight?: ReactNode;
    maxWidth?: 'sm' | 'lg' | 'full';
}

const maxWidthClasses = {
    sm: 'max-w-lg',
    lg: 'max-w-6xl',
    full: 'max-w-full',
};

export function PublicLayout({ title, description, children, showBack, headerRight, maxWidth = 'sm' }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-background pb-24">
            <Head title={title} />
            <header
                className="p-4 shrink-0 pt-[calc(var(--safe-top)+1rem)]"
                style={{ backgroundColor: 'var(--header-background)', color: 'var(--header-foreground)' }}
            >
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    {showBack ? (
                        <button
                            onClick={() => history.back()}
                            className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 transition-opacity"
                        >
                            <ArrowLeft className="size-4" />
                            Voltar
                        </button>
                    ) : (
                        <div className="flex-1" />
                    )}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
                    </div>
                    {headerRight || <div className="flex-1" />}
                </div>
            </header>
            <main className={`container mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]}`}>
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
