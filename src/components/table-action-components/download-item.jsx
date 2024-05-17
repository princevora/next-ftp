import {
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    ArrowDownTrayIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import path from "path";
import toast from "react-hot-toast";
import { useConfirmationContext } from "@/context/confirmation";
import { useEffect } from "react";

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

    const downloadFile = (data, endpoint) => new Promise(async (resolve, reject) => {
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
        else {
            const blob = await rsp.blob();
            const disposition = rsp.headers.get("Content-Disposition");
            const file_name = disposition ? disposition.split('filename="')[1].replace(/"/g, '') : "file.txt";

            resolve({ blob, file_name });
        }
    })

    const handleClick = async () => {
        const { endpoint, host, user, pass, currentPath } = ftpContext;
        const name = path.join(currentPath, fileName);
        const data = { host, user, pass, path: name, action: "get_file" };
        let shortName = fileName.length > 30 ? fileName.slice(0, 30) + '...' : fileName;
        shortName = path.basename(shortName);

        const loadingToast = toast.loading(`Downloading ${shortName}...`);
        await downloadFile(data, endpoint)
            .then((rsp) => {
                toast.dismiss(loadingToast);

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