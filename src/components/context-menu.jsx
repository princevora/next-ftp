import { useContextMenu } from "@/context/context-menu";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
    Card,
    Typography,
    Tooltip,
} from "@material-tailwind/react";
import DeleteItem from "./table-action-components/delete-item";
import RenameItem from "./table-action-components/rename-item";
import { useEffect } from "react";
import { ArrowDownTrayIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import DownloadItem from "./table-action-components/download-item";
import { useMoveItemContext } from "@/context/move-item";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import path from "path";
import { useBulkSelectContext } from "@/context/bulk-select";

export default function ContextMenu() {
    const context = useContextMenu();
    const selectContext = useBulkSelectContext();
    const ftpContext = useFtpDetailsContext();
    const { currentPath } = ftpContext.state;

    const setRenameElement = () => {
        const event = new CustomEvent("set:rename_ele", {
            detail: {
                file_name: context.element?.name,
            }
        });

        context.setIsVisible(false);
        window.dispatchEvent(event);
    }

    /**
     * fileName will be used as source (fromPath) path for context
     * 
     * @param {string} fileName 
     */
    const handleMoveItem = (fileName, type) => {
        const fromPath = path.join(currentPath, fileName);
        // selectContext.setItems({});
        selectContext.setIsItemsMoving(true);
        selectContext.setMovableItems({[fromPath]: type});
        // moveItemContext.setFromPath(fromPath);
        // context.setIsVisible(false);
    }

    let fileName;
    if(context.element && context.isVisible){
        fileName = context.element.name;
    }

    return (
        context.isVisible && context.element &&
        <Card className="absolute z-20 w-72" style={{ top: `${context.position.y}px`, left: `${context.position.x}px` }}>
            <ul>
                <li className="p-3 flex gap-1 cursor-pointer hover:bg-base-200 hover:rounded-md">
                    <RenameItem className="py-1 px-1" fileName={fileName} setRenameElement={setRenameElement} />
                    Rename
                </li>
                <li className="p-3 flex gap-1 cursor-pointer hover:bg-base-200 hover:rounded-md">
                    <DeleteItem className="py-1 px-1" fileName={fileName} type={context.element.type} />
                    Delete
                </li>
                <li className="p-3 flex gap-2 cursor-pointer hover:bg-base-200 hover:rounded-md">
                    <DownloadItem fileName={fileName} />
                    Download
                </li>
                <li className="p-3 flex gap-2 cursor-pointer hover:bg-base-200 hover:rounded-md" onClick={() => handleMoveItem(fileName, context.element.type)}>
                    <ArrowLeftOnRectangleIcon width={15} height={20} />
                    Move
                </li>
            </ul>
        </Card>
    );
}