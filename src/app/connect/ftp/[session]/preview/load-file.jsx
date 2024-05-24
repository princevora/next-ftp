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
        loadFile(ftp_host, ftp_username, ftp_password, ftp_port, path, (data) => {
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
    }, []);

    return (
        !state.isLoaded
            ? <PreviewSpinner progress={state.progress} />
            : <PreviewFile url={state.url} type={type} />
    )
}

export const loadFile = (ftp_host, ftp_username, ftp_password, ftp_port, path, getProgress) => new Promise(async (resolve, reject) => {
    const bodyData = { host: ftp_host, user: ftp_username, pass: ftp_password, port: ftp_port, action: "get_file", path }
    // create api url
    const endpoint = getRootUrl() + "/" + "api/ftp";

    // Fetch file blob.
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
        //Get json data
        const json = await response.json();

        toast.error(json?.data?.message || "Unable to fetch file");
    }

    else {
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
    }
})

export default LoadFile;