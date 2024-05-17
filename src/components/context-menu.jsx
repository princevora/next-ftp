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
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import DownloadItem from "./table-action-components/download-item";

export default function ContextMenu() {
    const context = useContextMenu();

    const setRenameElement = () => {
        const event = new CustomEvent("set:rename_ele", {
            detail: {
                file_name: context.element?.name,
            }
        });

        context.setIsVisible(false);
        window.dispatchEvent(event);
    }

    return (
        context.isVisible && context.element &&
        <Card className="absolute z-20 w-72" style={{ top: `${context.position.y}px`, left: `${context.position.x}px` }}>
            <ul>
                <li className="p-3 flex gap-1 cursor-pointer hover:bg-base-200 hover:rounded-md">
                    <RenameItem className="py-1 px-1" fileName={context.element.name} setRenameElement={setRenameElement} />
                    Rename
                </li>
                <li className="p-3 flex gap-1 cursor-pointer hover:bg-base-200 hover:rounded-md">
                    <DeleteItem className="py-1 px-1" fileName={context.element.name} type={context.element.type} />
                    Delete
                </li>
                <li className="p-3 flex gap-2 cursor-pointer hover:bg-base-200 hover:rounded-md">
                    <DownloadItem fileName={context.element.name} />
                    Download
                </li>
            </ul>
        </Card>
    );
}