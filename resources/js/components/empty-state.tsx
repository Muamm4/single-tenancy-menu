import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            {Icon && <Icon className="size-12 text-muted-foreground/40" />}
            <p className="text-lg font-medium">{title}</p>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
