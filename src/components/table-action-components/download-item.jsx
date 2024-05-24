import {
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import path from "path";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function DownloadItem({ fileName, className = "" }) {

    const ftpContext = useFtpDetailsContext().state;

    useEffect(() => {
        const handleFileGetEvent = (event) => {
            const name = event?.detail?.file_name;

            // Set the name as fileName
            fileName = name;

            handleClick();
        }

        window.addEventListener("file:get", handleFileGetEvent);

        return () => {
            window.removeEventListener("file:get", handleFileGetEvent);
        }
    }, [])

    /**
     * @param {object} data
     * @param {function} updateProgress
     */
    const downloadFile = (data, updateProgress) => new Promise(async (resolve, reject) => {
        const rsp = await fetch("/api/ftp", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!rsp.ok) {
            const json = await rsp.json();
            reject(json.data.message);
        }

        //Get content Type and custom header value to get file size in bytes
        const contentLength = rsp.headers.get('File-Size');
        const contentType = rsp.headers.get("Content-Type");

        //Get reader
        const reader = rsp.body.getReader();
        let receivedBytes = 0;
        let chunks = [];

        //Run a loop untill the download progress is done
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            // push the chunk
            chunks.push(value);

            // Concate the value length 
            receivedBytes += value.length;

            // Get approx progress value
            const progressValue = Math.round((receivedBytes / contentLength) * 100);

            // setProgress(progressValue);
            updateProgress(progressValue);
        }

        // Create a new Blob instance with appropriate content Type
        const blob = new Blob(chunks, { type: contentType });

        // Get file name from the response headers
        const disposition = rsp.headers.get("Content-Disposition");
        const file_name = disposition ? disposition.split('filename="')[1].replace(/"/g, '') : "file.txt";

        // resolve blob and file_name
        resolve({ blob, file_name });
    })

    const handleClick = async () => {
        // Get data from the ftpContext
        const { endpoint, host, user, pass, currentPath } = ftpContext;
        const name = path.join(currentPath, fileName);

        const data = { host, user, pass, path: name, action: "get_file" };

        // Get a short name
        let shortName = fileName.length > 30 ? fileName.slice(0, 30) + '...' : fileName;
        shortName = path.basename(shortName);


        const toastMsg = `Downloading ${shortName} `;

        // Start the download
        const toastId = toast.loading("Starting Download for " + shortName);

        // Call the promise function
        downloadFile(data, (progress) => {
            toast.loading(toastMsg + progress + "%...", { id: toastId });
        })
            .then((rsp) => {

                // Dismiss the loading toast when the response is resolved
                toast.dismiss(toastId);

                const { blob, file_name } = rsp;

                // create a object url
                const url = window.URL.createObjectURL(blob);

                // create link
                const link = document.createElement("a");

                // Create download link and href
                link.href = url;
                link.download = file_name;

                // Append Child
                document.body.appendChild(link)

                // Click the Link And download
                link.click()

                // Remove the Link
                document.body.removeChild(link);

                // Revoke url.
                window.URL.revokeObjectURL(url);

                toast.success(shortName + "  has been Downloaded..")
            })
            .catch((err) => toast.error(err));
    }

    return (
        <Typography as="a" href="#" variant="small" color="blue-gray" className={`font-medium ${className}`}>
            <Tooltip content={`Download: ${fileName}`}>
                <ArrowDownTrayIcon
                    onClick={handleClick}
                    height={20}
                    width={15}
                />
            </Tooltip>
        </Typography>
    )
}