import {
    Button,
    Typography,
} from "@material-tailwind/react";
import {
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useBulkSelectContext } from "../../context/bulk-select";
import { useConfirmationContext } from "../../context/confirmation";
import path from "path";
import { useFtpDetailsContext } from "../../context/ftp-details-context";
import toast from "react-hot-toast";

function DeleteSelected() {
    const context = useBulkSelectContext();
    const confirmationContext = useConfirmationContext();
    const ftp = useFtpDetailsContext();

    let files = [];

    const setBaseFiles = () => {
        for (const file in context.items) {
            files.push(path.basename(file))
        }
    }

    const deleteSelected = (data, endpoint) => new Promise(async (resolve, reject) => {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ ...data })
        });

        const json = await response.json();
        if (json.success) {
            resolve(json.data);
        }
        else {
            reject(json.data.message || "Unable to Complete The request.");
        }
    });

    const handleOnConfirm = () => {
        // Due to we are using context callbacks so we will hide the modal. to show the promise toast as below
        confirmationContext.setState(prev => ({
            ...prev,
            isVisible: false
        }));

        const { host, user, pass, endpoint } = ftp.state;
        const data = { host, user, pass, action: "deleteBulk", paths: context.items };

        try {
            const response = deleteSelected(data, endpoint);

            toast.promise(
                response,
                {
                    loading: `Deleting The Selected file(s)`,
                    success: (rsp) => rsp,
                    error: (err) => err
                }
            ).then(() => {
                // Emit an event to load files.
                const event = new CustomEvent("files:fetch", {
                    detail: {
                        path: ftp.state.currentPath || "/"
                    }
                })

                window.dispatchEvent(event);
            });
        } catch (error) {
            toast.error("Unable to complete the request");
        }
    }

    const handleClick = () => {
        setBaseFiles();
        const message = `You Are deleting The Following File(s) or Folder(s) Please confirm your Action. files: ${files.join(", ")}`;

        confirmationContext.setState(prev => ({
            ...prev,
            isVisible: true,
            modalTitle: "Delete Confirmation!",
            modalDesc: message,
            callback: handleOnConfirm
        }));
    }

    return (
        <Button
            variant="text"
            onClick={handleClick}
            disabled={context.isDisabled}
            className="text-xl p-2 font-medium bg-gray-200"
        >
            <Typography as="a" href="#" variant="small" color="blue-gray" className="duration-700 rounded" >
                <TrashIcon
                    height={15}
                    width={15}
                />
            </Typography >
        </Button>
    )
}

export default DeleteSelected;