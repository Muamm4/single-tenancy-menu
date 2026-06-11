import '../css/app.css';

import { createInertiaApp, usePage, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useEffect, useState, type ReactNode } from 'react';
import { initializeTheme } from './hooks/use-appearance';
import { ToastProvider } from './components/ui/Toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Global layout wrapping every page — loading bar + fade transition.
 * Uses `.layout` in `resolve` to live inside Inertia's context so usePage() works.
 */
function GlobalLayout({ children }: { children: ReactNode }) {
    const { url } = usePage();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const onStart = () => setLoading(true);
        const onFinish = () => setLoading(false);

        router.on('start', onStart);
        router.on('finish', onFinish);

        return () => {
            router.off('start', onStart);
            router.off('finish', onFinish);
        };
    }, []);

    return (
        <>
            <div
                className={`fixed top-0 left-0 right-0 z-[100] h-0.5 bg-primary transition-opacity duration-300 ${
                    loading ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <div className="h-full w-full animate-loading-bar bg-primary" />
            </div>

            <div key={url} className="animate-fade-in">
                {children}
            </div>
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        );

        const originalLayout = page.default.layout;
        page.default.layout = (pageComponent: ReactNode) => (
            <GlobalLayout>
                {originalLayout ? originalLayout(pageComponent) : pageComponent}
            </GlobalLayout>
        );

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ToastProvider>
                <App {...props} />
            </ToastProvider>
        );
    },
    progress: false,
});

initializeTheme();
