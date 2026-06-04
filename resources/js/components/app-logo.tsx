import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const appColors = (usePage().props as Record<string, unknown>).appColors as Record<string, string> | undefined;
    const title = appColors?.restaurant_name || 'Gameleira Esfiharia';

    return (
        <div className="flex items-center gap-3">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 text-white" />
            </div>
            <div className="flex flex-col justify-center leading-tight">
                <span className="font-semibold text-sm truncate max-w-[130px]">{title}</span>
                <span className="text-[11px] text-sidebar-primary-foreground/60">Gerencial</span>
            </div>
        </div>
    );
}
