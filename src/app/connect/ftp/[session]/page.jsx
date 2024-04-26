import React from 'react'
import Connect from "./connect";
import { Navbar } from '@/components';

export default function App({ params }) {
    return (
        <>
            <Navbar />
            <Connect params={params}/>
        </>
    )
}
