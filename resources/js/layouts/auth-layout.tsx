import { Head } from '@inertiajs/react';
import { BottomNav } from '@/components/public/BottomNav';

export default function AuthLayout({ children, title, description }: { children: React.ReactNode; title: string; description?: string }) {
    return (
        <div className="min-h-screen bg-background pb-24">
            <BottomNav />
            <Head title={title} />
            <header
                className="p-4 shrink-0 pt-[calc(var(--safe-top)+1rem)]"
                style={{ backgroundColor: 'var(--header-background)', color: 'var(--header-foreground)' }}
            >
                <div className="flex items-center justify-center max-w-6xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8 max-w-lg">
                {children}
            </main>
        </div>
    );
}
