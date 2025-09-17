'use client'

import { redirect } from 'next/navigation'
import SVG from "./svg";
import { SearchModal } from './SearchModal';
import { useState } from 'react';

export default function Header() {

    const [openChangeSearcher, setOpenChangeSearcher] = useState<boolean>(false)

    const handleRouter = () => {
        redirect('/')
    }

    return (
        <>
            <header className="flex flex-row w-full h-auto items-center px-[1rem]">
                <div className="basis-1/5" />
                <h1 className="font-testSohneBuch text-[3.2rem] text-center cursor-pointer basis-3/5" onClick={handleRouter}>
                    DiscussBook
                </h1>
                <div
                    className="flex flex-col justify-center items-end basis-1/5 h-full cursor-pointer"
                    onClick={() => setOpenChangeSearcher(!openChangeSearcher)}
                >
                    <div id="container-search" className="w-[2.5rem] h-[2.5rem]">
                        <SVG type="search" color="var(--neutral500)" />
                    </div>
                </div>
            </header>
            <SearchModal open={openChangeSearcher} setOpen={setOpenChangeSearcher} />
        </>

    );
}
