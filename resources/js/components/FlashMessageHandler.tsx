import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/components/ui/Toast';

export function FlashMessageHandler() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const { addToast } = useToast();

    useEffect(() => {
        if (flash?.success) {
            addToast(flash.success, 'success');
        }
        if (flash?.error) {
            addToast(flash.error, 'error');
        }
    }, [flash?.success, flash?.error]);

    return null;
}
