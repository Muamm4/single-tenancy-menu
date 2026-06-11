import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardSkeletonProps {
    variant?: 'grid' | 'list';
}

export function ProductCardSkeleton({ variant = 'grid' }: ProductCardSkeletonProps) {
    if (variant === 'list') {
        return (
            <div className="flex gap-4 p-0 bg-card border border-border rounded-lg overflow-hidden">
                <Skeleton className="w-28 h-28 shrink-0 rounded-none" />
                <div className="flex flex-col justify-between py-3 pr-3 min-w-0 flex-1 gap-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-7 w-20 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="size-5 shrink-0 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>
            </div>
        </div>
    );
}
