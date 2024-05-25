import { useEffect, useState } from "react";
import { loadFile } from "../preview/load-file";
import langMap from 'lang-map';
import PreviewSpinner from "@/components/spinner";
import Editor from "./editor";
import { getRootUrl } from "@/helper";
import pathModule from "path";
import toast from "react-hot-toast";

function LoadFile({ path, data }) {
    const [state, setState] = useState({
        progress: 0,
        isLoaded: false,
        url: "",
        code: "",
        lang: "plaintext",
        isBlobLoaded: false,
        contentType: "text/plain"
    })
    const { ftp_username, ftp_password, ftp_port, ftp_host } = data;

    const loadFileText = async () => {
        await fetch(state.url)
            .then(async (rsp) => {
                const text = await rsp.text();
                let value = text !== "" ? text : "";

                // Extract the file extension from the URL
                const fileExtension = path.split('.').pop();

                // Map the file extension to a Monaco language
                const lang = langMap.languages(fileExtension)[0] || 'plaintext';

                let contentType = rsp.headers.get("Content-Type");

                setState(prev => ({
                    ...prev,
                    code: value,
                    lang,
                    contentType,
                    isBlobLoaded: true
                }))
            });
    }

    useEffect(() => {
        setState(prev => ({
            ...prev,
            progress: 0,
        }));

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
    }, []);

    useEffect(() => {
        if (state.isLoaded) {
            loadFileText()
        }
    }, [state.isLoaded]);

    const handleChange = (code) => {
        setState(prev => ({
            ...prev,
            code
        }));
    }

    const saveFile = () => new Promise(async (resolve, reject) => {
        // Create request to upload the file
        const ednpoint = getRootUrl() + "/api/ftp";

        const currentPath = pathModule.dirname(path);

        const formData = new FormData();
        formData.append("host", ftp_host);
        formData.append("user", ftp_username);
        formData.append("pass", ftp_password);
        formData.append("port", ftp_port);
        formData.append("path", currentPath);
        formData.append("action", "upload");

        const fileName = pathModule.basename(path);

        const content = state.code || " ";

        // Create file.
        const blob = new Blob([content])
        const file = new File([blob], fileName);

        // append file.
        formData.append("file", file);

        const response = await fetch(ednpoint, {
            method: "POST",
            body: formData
        })

        if(!response.ok){
            const json = await response.json();

            reject(json?.data?.message);
        } else {
            resolve("File has been saved successfully");
        }
    })

    const handleClick = async () => {
        const response = saveFile();

        toast.promise(response, {
            loading: "Saving file",
            success: (msg) => msg,
            error: (err) => err
        });
    }

    return (
        !state.isLoaded && !state.isBlobLoaded
            ? <PreviewSpinner progress={state.progress} />
            : <Editor code={state.code} lang={state.lang} handleChange={handleChange} handleClick={handleClick} />
    )
}

export default LoadFile;