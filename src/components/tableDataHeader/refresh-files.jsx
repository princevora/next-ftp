import {
    Button,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    ArrowPathIcon,
    ArrowUpTrayIcon
} from "@heroicons/react/24/outline";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import { useEffect } from "react";

function RefreshFiles() {
    const context = useFtpDetailsContext();
    const { currentPath } = context.state;

    const handleClick = () => {
        const event = new CustomEvent("files:fetch", {
            detail: {
                path: currentPath,
                ignoreRootsUpdate: true
            }
        });

        // Dispatch
        window.dispatchEvent(event);
    }

    return (
        <Tooltip content="Refresh">
            <Button variant="text" onClick={handleClick} className="rounded text-xl p-2  font-medium bg-gray-200 group">
                <Typography as="a" href="#" variant="small" color="blue-gray">
                    <ArrowPathIcon
                        className="group-hover:rotate-45 transition-transform transform duration-300"
                        height={15}
                        width={15}
                    />
                </Typography>
            </Button>
        </Tooltip>
    )
}

export default RefreshFiles;