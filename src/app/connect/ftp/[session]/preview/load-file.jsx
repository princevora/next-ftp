import { getRootUrl } from "@/helper";
import { progress } from "@material-tailwind/react";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import PreviewSpinner from "@/components/spinner";
import PreviewFile from "./preview-file";

function LoadFile({ path, type, data }) {
    const [state, setState] = useState({
        isLoaded: false,
        path: "",
        type: null,
        url: "",
        progress: null
    });

    // Get ftp details from data
    const { ftp_username, ftp_host, ftp_password, ftp_port } = data;

    useEffect(() => {
        // Update state with path and type
        setState(prev => ({
            ...prev,
            path,
            type
        }));

        // Load the file
        const abortController = new AbortController();
        const { signal } = abortController;

        loadFile(ftp_host, ftp_username, ftp_password, ftp_port, path, signal, (data) => {
            const { progress } = data;
            const isLoaded = data?.isLoaded || false;

            setState(prev => ({
                ...prev,
                progress,
                isLoaded
            }));
        }).then((url) => {
            setState(prev => ({
                ...prev,
                url
            }))
        });

        return () => {
            try {
                abortController.abort();
            } catch (error) {
                console.log("err");
            }
        }
    }, []);

    return (
        !state.isLoaded
            ? <PreviewSpinner progress={state.progress} />
            : <PreviewFile url={state.url} type={type} />
    )
}

export const loadFile = (ftp_host, ftp_username, ftp_password, ftp_port, path, signal, getProgress) => new Promise(async (resolve, reject) => {
    const bodyData = { host: ftp_host, user: ftp_username, pass: ftp_password, port: ftp_port, action: "get_file", path }
    // create api url
    const endpoint = getRootUrl() + "/" + "api/ftp";

    try {
        // Fetch file blob.
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData),
            signal
        });

        if (!response.ok) {
            //Get json data
            const json = await response.json();

            toast.error(json?.data?.message || "Unable to fetch file");
            reject(new Error("Unable to fetch file"));
            return;
        }

        const contentLength = response.headers.get('File-Size');
        const contentType = response.headers.get("Content-Type");

        let total;

        if (contentLength) {
            total = parseInt(contentLength, 10);
        }

        // Get the reader
        const reader = response.body.getReader();
        let receivedBytes = 0;
        let chunks = [];

        // run while loop
        while (true) {
            // Check if the request has been aborted
            if (signal.aborted) {
                reject(new Error('Request aborted'));
                return;
            }

            const { done, value } = await reader.read();

            // Break the loop if the the blob is loaded
            if (done) {
                getProgress({
                    isLoaded: true,
                    progress: 100
                })

                break;
            };

            receivedBytes += value.length;

            // Push chunks
            chunks.push(value);

            let progress = Math.round((receivedBytes / total) * 100);

            // send progress
            getProgress({
                progress,
            })
        }

        // Create blob
        const blob = new Blob(chunks, { type: contentType });

        // Create object url from blob
        const url = window.URL.createObjectURL(blob);

        // Return Resolve
        resolve(url);
    } catch (error) {
        if (error.name === 'AbortError') {
            // Request was aborted
            reject('Request aborted');
        } else {
            reject(error);
        }
    }
});


export default LoadFile;