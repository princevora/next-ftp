import { useEffect, useState } from "react";
import { loadFile } from "../preview/load-file";
import { Editor } from "@monaco-editor/react";

function LoadFile({ path, data }) {
    const [state, setState] = useState({
        progress: 0,
        isLoaded: false,
        url: "",
        code: "",
        land: "plaintext"
    })
    const { ftp_username, ftp_password, ftp_port, ftp_host } = data;

    useEffect(() => {
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

        const loadFileText = async () => {
            const response = await fetch(state.url);
            const value = await response.text();
            const contentType = response.headers.get("Content-Type").split("/").pop();

            setState(prev => ({
                ...prev,
                code: value,
                lang: contentType
            }))
        }

        loadFileText();

    }, []);

    return (
        <Editor theme="vs-dark" language={state.lang} value={state.code} height="100vh" />
    )
}

export default LoadFile;