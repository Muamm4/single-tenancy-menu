import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_admin?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface AddonCategory {
    id: number;
    name: string;
    min_select: number;
    max_select: number;
    is_active: boolean;
    sort_order: number;
    addons?: Addon[];
    pivot?: { product_id: number; addon_category_id: number };
}

export interface Addon {
    id: number;
    addon_category_id: number;
    name: string;
    price: number;
    formatted_price?: string;
    is_active: boolean;
    sort_order: number;
    addon_category?: AddonCategory;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    products: Product[];
    products_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    price: number;
    promotional_price: number | null;
    formatted_price?: string;
    formatted_promotional_price?: string;
    has_promotion?: boolean;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    category?: Category;
    addon_categories?: AddonCategory[];
    created_at?: string;
    updated_at?: string;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
    category_name?: string;
    unit_price?: number;
    subtotal?: number;
    product_name?: string;
    addons?: { id: number; name: string; price: number }[];
    _key?: string;
}

export interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    items: CartItem[];
    total: number;
    formatted_total?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready';
    whatsapp_sent: boolean;
    notes: string | null;
    address_id?: number | null;
    address?: Address | null;
    created_at: string;
    updated_at?: string;
}

export interface Address {
    id: number;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zip_code: string;
    is_default: boolean;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLink[];
    meta: PaginationMeta;
}
