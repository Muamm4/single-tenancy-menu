import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { FlashMessageHandler } from '@/components/FlashMessageHandler';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <FlashMessageHandler />
        <div className="flex h-full flex-1 flex-col gap-6 p-6">
            {children}
        </div>
    </AppLayoutTemplate>
);
