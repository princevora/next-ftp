import {
    Button,
    Typography,
} from "@material-tailwind/react";
import {
    ClipboardIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { useMoveItemContext } from "../../context/move-item";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import path from "path";
import toast from "react-hot-toast";
import { useBulkSelectContext } from "@/context/bulk-select";

function PasteItem() {
    const context = useMoveItemContext();
    const selectContext = useBulkSelectContext();
    const ftpContext = useFtpDetailsContext();

    
    const moveItem = (endPoint, data) => new Promise( async (resolve, reject) => {
        const response = await fetch(endPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const json = await response.json();

        if(!response.ok){
            reject(json?.data?.message || "Unable to Move file.");
        }else{
            resolve("The file has been moved successfully");
        }
    })
    
    const handleClick = async () => {
        const {endpoint, currentPath, host, user, pass, port} = ftpContext.state;
        const from = selectContext.movableItems;
        const to = currentPath;
        const data = {host, user, pass, port, from, to, action: "move"};

        const response = moveItem(endpoint, data);
        
        toast.promise(response, {
            loading: `Moving Files To Current Directory`,
            error: (error) => error,
            success: (msg) => msg
        })
        .then(() => {
            // Set fromPath to empty.
            selectContext.setIsItemsMoving(false);
            selectContext.setMovableItems({});

            // Reload the files.
            const event = new CustomEvent('files:fetch', {detail: {path: currentPath, ignoreRootsUpdate: true}});
            window.dispatchEvent(event);
        });
    }     
       
    return (
        <Button 
            variant="text" 
            onClick={handleClick} 
            className="rounded text-xl p-2 font-medium bg-gray-200" 
        >
            <Typography as="a" href="#" variant="small" color="blue-gray">
                <ClipboardIcon
                    height={15}
                    width={15}
                />
            </Typography>
        </Button>
    )
}

export default PasteItem;