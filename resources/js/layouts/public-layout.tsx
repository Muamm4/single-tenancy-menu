import { Head } from '@inertiajs/react';
import { BottomNav } from '@/components/public/BottomNav';
import { ArrowLeft } from 'lucide-react';
import { useRef, useEffect, type ReactNode } from 'react';

interface PublicLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
    showBack?: boolean;
    headerRight?: ReactNode;
    maxWidth?: 'sm' | 'lg' | 'full' | 'none';
    customHeader?: ReactNode;
    showBottomNav?: boolean;
    footer?: ReactNode;
}

const maxWidthClasses: Record<string, string> = {
    sm: 'max-w-lg',
    lg: 'max-w-6xl',
    full: 'max-w-full',
    none: '',
};

export function PublicLayout({
    title,
    description,
    children,
    showBack,
    headerRight,
    maxWidth = 'sm',
    customHeader,
    showBottomNav = true,
    footer,
}: PublicLayoutProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to top when navigating to a new page
        scrollRef.current?.scrollTo(0, 0);
    }, [title]);

    const mainClasses = [
        'flex-1 overflow-y-auto',
        maxWidth === 'none' ? '' : `container mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]}`,
        showBottomNav && 'pb-24',
    ].filter(Boolean).join(' ');

    return (
        <div className="h-dvh flex flex-col overflow-hidden bg-background">
            <Head title={title} />

            {customHeader ?? (
                <header
                    className="shrink-0 p-4 pt-[calc(var(--safe-top)+1rem)]"
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
                            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                            {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
                        </div>
                        {headerRight || <div className="flex-1" />}
                    </div>
                </header>
            )}

            <main ref={scrollRef} className={mainClasses}>
                {children}
            </main>

            {footer}

            {showBottomNav && <BottomNav />}
        </div>
    );
}
