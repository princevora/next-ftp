import {
    Button,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {
    ArrowUpTrayIcon
} from "@heroicons/react/24/outline";
import { useUploadFileContext } from "@/context/file-upload";

function UploadItems() {
    const context = useUploadFileContext();

    const handleClick = () => {
        context.setIsVisible(prev => !prev)
    }

    return (
        <Tooltip content="Upload Files">
            <Button variant="text" onClick={handleClick} className="rounded text-xl p-2 font-medium bg-gray-200 group">
                <Typography as="a" href="#" variant="small" color="blue-gray">
                    <ArrowUpTrayIcon
                        className="group-hover:animate-bounce duration-500 transform"
                        height={15}
                        width={15}
                    />
                </Typography>
            </Button>
        </Tooltip>
    )
}

export default UploadItems;