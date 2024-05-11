"use client";

import React, { useEffect, useState } from 'react'
import Connect from "./connect";
import { Navbar } from '@/components';
import { useSideBarContext } from '@/context/sidebar';
import Paths from "@/components/paths";
import { Card } from '@material-tailwind/react';

export default function App({ params }) {
    const collapseContext = useSideBarContext();
    const { open } = collapseContext;
    const [isSm, setIsSm] = useState(false);
    const [isDropping, setIsDropping] = useState(false);

    useEffect(() => {
        window.addEventListener("resize", () => {
            window.innerWidth >= 960 && collapseContext.setOpen(false);
            window.innerWidth <= 611 && setIsSm(true);
        });
    }, [])

    const handleDrop = () => {
        setIsDropping(true);
    }

    return (
        <>
            <Navbar />
            <div className="max-h-full flex h-screen" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <Card className={`lg:w-[25%] bg-base-200 overflow-auto ${!open ? "hidden lg:block" : ""}  ${open && " w-[50%] visible"} shadow-xl rounded-md`}>
                    <Paths />
                </Card>
                <div className={`lg:w-[75%] ${open ? "w-[50%]" : ""} w-[100%] overflow-y-auto`}>
                    <Connect params={params} />
                </div>
            </div>
        </>
    )
}
