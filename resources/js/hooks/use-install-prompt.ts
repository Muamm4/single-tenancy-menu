import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

export function useInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        const isStandalone = window.matchMedia(
            '(display-mode: standalone)'
        ).matches;
        const hasBeforeInstallPrompt = 'onbeforeinstallprompt' in window;

        setIsSupported(hasBeforeInstallPrompt);
        setIsInstalled(isStandalone);

        if (isStandalone || !hasBeforeInstallPrompt) return;

        const handler = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const onInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handler);
        window.addEventListener('appinstalled', onInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const install = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('PWA install outcome:', outcome);
        setDeferredPrompt(null);
    };

    return {
        canInstall: !!deferredPrompt && !isInstalled,
        isInstalled,
        isSupported,
        install,
    };
}
