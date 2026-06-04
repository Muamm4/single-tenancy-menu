export type Appearance = 'light';

export function initializeTheme() {
    document.documentElement.classList.remove('dark');
}

export function useAppearance() {
    return { appearance: 'light' as const, updateAppearance: () => {} };
}
