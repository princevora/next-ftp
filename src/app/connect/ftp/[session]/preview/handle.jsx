"use client";

import { usePasswordContext } from "@/context/encrypt-password";
import { useEffect, useState } from "react";
import ConnectionError from "@/app/connect/page";
import pathModule from "path";
import LoadFile from "./load-file";
import CryptoJs from "crypto-js"
import ImportHotToast from "@/components/import-toaster";

const validExtensions = {
    // Image type
    "jpeg": 1,
    "png": 1,
    "jpg": 1,
    "svg": 1,

    // Video types
    "mp4": 2,
    "avi": 2,
    "mov": 2,
    "wmv": 2,

    // Audio types
    "mp3": 3,
    "wav": 3,
}

function Preview({ params, searchParams }) {
    const [state, setState] = useState({
        isValid: false,
        message: '',
        isClient: false,
        path: "",
        type: null,
        sessionData: null,
    });

    const { session } = params;
    const password = usePasswordContext();

    const encData = CryptoJs.AES.decrypt(decodeURIComponent(session), password);
    let data;

    try {
        data = JSON.parse(encData.toString(CryptoJs.enc.Utf8));
    } catch (error) {
        data = null;
    }

    useEffect(() => {

        const path = searchParams?.path || null;

        if (data !== null) {
            if (path !== null && path !== '') {
                const ext = pathModule.extname(path).split(".").pop();
                if (Object.keys(validExtensions).includes(ext)) {
                    // Set as valid.
                    setState(prev => ({
                        ...prev,
                        isValid: true,
                        path,

                        // set session (ftp data)
                        sessionData: data,

                        // Set extension type.
                        type: validExtensions[ext]
                    }));
                }
                else {
                    setState(prev => ({
                        ...prev,
                        message: "The provided file Extension is currently not supported."
                    }));
                }


            } else {
                setState(prev => ({
                    ...prev,
                    message: "Please Provide a valid path or type"
                }));
            }
            setState(prev => ({
                ...prev,
                isClient: true
            })); // Mark that the component has rendered on the client
        }
        else {
            setState({ message: "Please Provide Valid FTP Details" });
        }

    }, [searchParams]);

    if (!state.isClient) {
        // Initial render to prevent hydration mismatch
        return null;
    }

    return (
        <>
            <ImportHotToast />
            {
                state.isValid
                    ? <LoadFile path={state.path} type={state.type} data={state.sessionData} />
                    : <ConnectionError messageText={state.message} />
            }
        </>
    )
}

export default Preview;
