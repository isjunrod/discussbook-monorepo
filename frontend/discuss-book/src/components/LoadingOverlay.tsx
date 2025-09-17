'use client';

import { useContext } from 'react';
import { ThemeContext } from '../state/context';

export default function LoadingOverlay() {
    const { state } = useContext(ThemeContext);

    if (!state.loading?.is) return null;

    return (
        <div className="fixed bg-black inset-0 bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-neutral-800 p-8 rounded-xl shadow-2xl flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
                <p className="text-white text-xl font-testSohneBuch">{state?.loading?.message}</p>
            </div>
        </div>
    );
}