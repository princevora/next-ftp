"use client";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {
    Card,
    CardBody,
} from "@material-tailwind/react";
import SearchPathSkeleton from "@/components/skeletons/search-path-skeleton";
import { useEffect, useState } from 'react';


export default function TableSkeleton() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            <SearchPathSkeleton />
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
            <td className='grid md:grid-cols-[6%_auto] sm:grid-cols-1 px-3 py-1'>
                {/* {isClient && typeof window !== 'undefined' && window.innerWidth > 768 && (
                    <> */}
                        <Skeleton containerClassName='mt-2 mx-2' height={30} width={30} />
                        <Skeleton height={42} />
                    {/* </> */}
                {/* )} */}
            </td>

        </tr>
    )
}