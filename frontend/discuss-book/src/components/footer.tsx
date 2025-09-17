import { PanelLeft } from 'lucide-react';
import React from 'react';
import SVG from './svg';

export default function Footer() {
    return (
        <footer className="h-auto flex flex-row justify-between w-full p-[1rem]">
            <div className="cursor-pointer">
                <PanelLeft color="#737373" />
            </div>
            <div className="w-[2.5rem] h-[2.5rem] cursor-pointer">
                <a rel="noopener noreferrer" href={'https://x.com/JunRod_'} target="_blank">
                    <SVG type="x" color="var(--neutral500)" />
                </a>
            </div>
        </footer>
    );
}
