import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export function Pagination({ links }: PaginationProps) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-1 border-t p-4">
            {links.map((link, index) => {
                if (index === 0 || index === links.length - 1) {
                    return null;
                }

                return (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={`flex size-8 items-center justify-center rounded text-sm ${
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                        }`}
                        preserveScroll
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}
