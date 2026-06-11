import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Tags, ShoppingBag, Package, ListOrdered, Palette, Store } from 'lucide-react';
import AppLogo from './app-logo';

const sidebarGroups: NavGroup[] = [
    {
        title: 'Dashboard',
        items: [
            { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
        ],
    },
    {
        title: 'Produtos',
        items: [
            { title: 'Categorias', href: '/admin/categories', icon: Tags },
            { title: 'Produtos', href: '/admin/products', icon: ShoppingBag },
            { title: 'Adicionais', href: '/admin/addon-categories', icon: Package },
        ],
    },
    {
        title: 'Gerencial',
        items: [
            { title: 'Pedidos', href: '/admin/orders', icon: ListOrdered },
            { title: 'Aparência', href: '/admin/settings/appearance', icon: Palette },
        ],
    },
    {
        title: 'Cardápio',
        items: [
            { title: 'Ver Cardápio', href: '/', icon: Store },
        ],
    },
];

const footerNavItems = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={sidebarGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
