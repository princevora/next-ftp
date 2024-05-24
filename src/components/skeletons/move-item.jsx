"use client";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import SearchPathSkeleton from "@/components/skeletons/search-path-skeleton";
import { useEffect, useState } from 'react';


export default function MoveItemSkeleton() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <Skeleton height={20} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array(3).fill().map((_, k) => {
                        return <Row key={k} isClient={isClient} />
                    })}
                </tbody>
            </table>
        </>
    )
}

function Row({ isClient }) {
    return (
        <tr>
            <td className=' px-3 py-1'>
                {/* {isClient && typeof window !== 'undefined' && window.innerWidth > 768 && (
                    <> */}
                        <Skeleton height={42} />
                    {/* </> */}
                {/* )} */}
            </td>

        </tr>
    )
}