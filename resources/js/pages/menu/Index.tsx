import { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Category } from '@/types';
import { ProductCard } from '@/components/public/ProductCard';
import { BottomNav } from '@/components/public/BottomNav';
import { LayoutGrid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

interface DayHours {
    day: number;
    open: string;
    close: string;
    closed: boolean;
}

interface MenuIndexProps {
    categories: Category[];
    hours: DayHours[];
}

function getTodayHours(hours: DayHours[]): { today: DayHours | null; dayName: string } {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const today = new Date().getDay();
    const todayHours = hours.find((h) => h.day === today);
    return { today: todayHours ?? null, dayName: dayNames[today] };
}

export default function MenuIndex({ categories, hours }: MenuIndexProps) {
    const { appColors } = usePage().props as unknown as { appColors: Record<string, string> };
    const restaurantName = appColors?.restaurant_name || '';

    const { today: todayHours, dayName } = getTodayHours(hours);
    const [activeCategory, setActiveCategory] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('cardapio-view') as ViewMode) || 'grid';
        }
        return 'grid';
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            for (const category of categories) {
                const element = document.getElementById(category.slug);
                if (element) {
                    const offsetTop = element.offsetTop - container.offsetTop;
                    if (scrollTop >= offsetTop - 100) {
                        setActiveCategory(category.slug);
                    }
                }
            }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [categories]);

    const scrollToCategory = (slug: string) => {
        const element = document.getElementById(slug);
        const container = scrollRef.current;
        if (element && container) {
            const offsetTop = element.offsetTop - container.offsetTop - 100;
            container.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
        }
    };

    const toggleView = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem('cardapio-view', mode);
    };

    return (
        <>
            <Head title="Cardápio" />
            <div className="h-dvh flex flex-col overflow-hidden bg-background">
                <header className="p-4 shrink-0 pt-[calc(var(--safe-top)+1rem)]" style={{ backgroundColor: 'var(--header-background)', color: 'var(--header-foreground)' }}>
                    <div className="flex items-center justify-between max-w-6xl mx-auto">
                        <div className="flex-1" />
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight">{restaurantName || 'Cardápio'}</h1>
                            <p className="mt-1 text-sm opacity-90">Escolha seus produtos favoritos</p>
                            {todayHours && (
                                <p className="mt-1 text-xs opacity-75">
                                    {todayHours.closed
                                        ? `Fechado hoje (${dayName})`
                                        : `Aberto hoje • ${todayHours.open} - ${todayHours.close}`
                                    }
                                </p>
                            )}
                        </div>
                        <div className="flex-1 flex justify-end">
                            <div className="flex bg-black/20 rounded-lg p-0.5 gap-0.5">
                                <button
                                    onClick={() => toggleView('grid')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white/80'}`}
                                    title="Visualização em grade"
                                >
                                    <LayoutGrid className="size-4" />
                                </button>
                                <button
                                    onClick={() => toggleView('list')}
                                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white/80'}`}
                                    title="Visualização em lista"
                                >
                                    <List className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b py-3 px-4 shrink-0">
                    <div className="flex flex-wrap gap-1.5 justify-center max-w-2xl mx-auto">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => scrollToCategory(category.slug)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${activeCategory === category.slug
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </nav>

                <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 mb-16 space-y-12 pb-[calc(var(--safe-bottom)+7rem)]">
                    {categories.map((category) => (
                        <section key={category.id} id={category.slug} className="scroll-mt-24">
                            <h2 className="text-2xl font-semibold tracking-tight mb-8 border-b pb-2">{category.name}</h2>
                            {category.description && <p className="text-muted-foreground mb-8">{category.description}</p>}

                            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-3'}>
                                {category.products.map((product) => (
                                    <ProductCard key={product.id} product={product} variant={viewMode} />
                                ))}
                            </div>
                        </section>
                    ))}
                </main>

                <BottomNav />
            </div>
        </>
    );
}
