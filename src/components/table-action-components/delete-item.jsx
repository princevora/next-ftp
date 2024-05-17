import {
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import path from "path";
import toast from "react-hot-toast";
import { useConfirmationContext } from "@/context/confirmation";

export default function DeleteItem({ fileName, type, className = "" }) {

    const ftpContext = useFtpDetailsContext().state;
    const confirmationContext = useConfirmationContext();

    /**
     * 
     * @param {string} name get the file path and delete the file and retrun a promise 
     */
    const deleteFile = (data, name, endpoint) => new Promise(async (resolve, reject) => {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ ...data, from: name, type })
        });

        const json = await response.json();
        if (json.success) {
            resolve(json.data);
        }
        else {
            reject(json.data.message);
        }
    })

    const handleDelete = async () => {
        // Due to we are using context callbacks so we will hide the modal. to show the promise toast as below
        confirmationContext.setState(prev => ({
            ...prev,
            isVisible: false
        }));

        
        const { endpoint, host, user, pass, currentPath } = ftpContext;
        const data = { host, user, pass, action: "delete" };
        
        const name = path.join(currentPath, fileName);

        try {
            const response = deleteFile(data, name, endpoint);

            toast.promise(
                response,
                {
                    loading: `Deleting The File ${fileName}`,
                    success: (rsp) => rsp,
                    error: (err) => err
                }
            ).then(() => {
                // Emit an event to load files.
                const event = new CustomEvent("files:fetch", {
                    detail: {
                        path: currentPath ?? "/"
                    }
                })

                window.dispatchEvent(event);
            });
        } catch (error) {
            toast.error("Unable to complete the request");
        }
    }

    // Handle Delete on click.
    const handleClick = () => {
        confirmationContext.setState(prev => ({
            ...prev,
            isVisible: true,
            modalTitle: `Confirm Delete ${fileName}`,  //Title 
            modalDesc: "Are you sure? You are deleting a file please confirm your action" //Desc
        }));

        // set the callback in confirmationContext
        confirmationContext.setState(prev => ({
            ...prev,
            callback: handleDelete
        }))
    }

    return (
        <Typography as="a" href="#" variant="small" color="blue-gray" className={`font-medium ${className}`}>
            <Tooltip content={`Delete: ${fileName}`}>
                <TrashIcon
                    onClick={handleClick}
                    height={15}
                    width={15}
                />
            </Tooltip>
        </Typography>
    )
}