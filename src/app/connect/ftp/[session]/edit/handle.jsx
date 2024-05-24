"use client";
import ImportHotToast from "@/components/import-toaster";
import { usePasswordContext } from "@/context/encrypt-password";
import CryptoJs from "crypto-js";
import LoadFile from "./load-file";
import ConnectionError from "@/app/connect/page";
import { useEffect, useState } from "react";

function Handle(params) {
    const [state, setState] = useState({
        isValid: false,
        path: "/",
        message: "",
        sessionData: null,
        isClient: false
    });

    const { session } = params.params;
    const path = params?.searchParams?.path;
    // console.log(params);
    const password = usePasswordContext();

    const encData = CryptoJs.AES.decrypt(decodeURIComponent(session), password);
    let data;

    try {
        data = JSON.parse(encData.toString(CryptoJs.enc.Utf8));
    } catch (error) {
        data = null
    }

    useEffect(() => {
        if (data !== null && ( typeof path !== "null" || typeof path !== "undefined" )) {
            setState(prev => ({
                ...prev,
                isValid: true,
                sessionData: data,
                isClient: true,
                path
            }));
        } else {
            // Set message and is valid to false
            setState(prev => ({
                ...prev,
                message: "Cannot find ftp details",
            }))
        }
    }, []);

    if (!state.isClient) {
        // Initial render to prevent hydration mismatch
        return null;
    }

    return (
        <>
            <ImportHotToast />
            {
                state.isValid
                    ? <LoadFile path={state.path} data={state.sessionData} />
                    : <ConnectionError messageText={state.message} />
            }
        </>
    )
}

export default Handle;