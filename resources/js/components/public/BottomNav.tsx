import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, User, ShoppingCart, ClipboardList, Download } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/use-install-prompt';

export function BottomNav() {
    const { url, props } = usePage();
    const appColors = (props as any).appColors as Record<string, string> | undefined;
    const menuOnly = appColors?.menu_only === 'true';
    const { canInstall, install } = useInstallPrompt();

    const navItems = [
        {
            name: 'Cardápio',
            href: route('menu'),
            icon: ShoppingBag,
            active: url === '/' || url.startsWith('/menu') || url === route('menu')
        },
        ...(menuOnly ? [] : [
            {
                name: 'Carrinho',
                href: route('cart'),
                icon: ShoppingCart,
                active: url.startsWith('/cart')
            },
            {
                name: 'Pedidos',
                href: route('customer.orders'),
                icon: ClipboardList,
                active: url.startsWith('/my-orders')
            },
        ]),
        {
            name: 'Conta',
            href: route('profile.edit'),
            icon: User,
            active: url.startsWith('/settings/profile')
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 px-4">
            <div className="max-w-md mx-auto flex justify-around items-center">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`relative flex flex-col items-center gap-1 transition-all duration-200 active:scale-90 ${item.active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                    >
                        <item.icon className={`size-6 transition-all duration-200 ${item.active ? 'fill-primary/20 scale-110' : ''}`} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                        {item.active && (
                            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                    </Link>
                ))}

                {canInstall && (
                    <button
                        onClick={install}
                        className="flex flex-col items-center gap-1 transition-all duration-200 active:scale-90 text-primary"
                        title="Instalar aplicativo"
                    >
                        <Download className="size-6" />
                        <span className="text-[10px] font-medium">Instalar</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
